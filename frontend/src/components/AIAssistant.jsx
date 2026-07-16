import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { sendChatMessage } from "../services/aiService";
import LoadingSpinner from "./LoadingSpinner";

// Simple custom inline parser for basic Markdown (*bold*, `code`, and newlines)
function formatMessage(text) {
  if (!text) return "";
  
  // Format code blocks
  let formatted = text.replace(/```([\s\S]*?)```/g, (match, p1) => {
    return `<pre class="bg-surface border border-default p-2 rounded text-xs font-mono overflow-x-auto my-2">${p1.trim()}</pre>`;
  });
  
  // Format inline code
  formatted = formatted.replace(/`([^`\n]+)`/g, '<code class="bg-surface px-1.5 py-0.5 rounded text-xs font-mono font-semibold">$1</code>');
  
  // Format bold text
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
  
  // Format bullet points
  formatted = formatted.replace(/^\s*[-*]\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Convert newlines to breaks (avoiding replacing within list items or pre blocks directly)
  formatted = formatted.split("\n").map(line => {
    if (line.includes("<li") || line.includes("<pre") || line.includes("</pre>")) {
      return line;
    }
    return line + "<br />";
  }).join("\n");

  return formatted;
}

export default function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "greeting",
      sender: "ai",
      text: `Hi ${user?.name || "there"}! I'm **OnboardAI**, your agentic onboarding assistant. Ask me anything about company policies, your training checklist, or who your manager is!`,
      createdAt: new Date(),
      toolsUsed: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messageEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsgText = input.trim();
    setInput("");

    const userMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "user",
      text: userMsgText,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Compile history for context (exclude greeting if needed, or keep latest 6)
      const chatHistory = messages
        .slice(-6)
        .map((m) => ({ sender: m.sender, text: m.text }));

      const res = await sendChatMessage(userMsgText, chatHistory);

      const aiMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: res.reply || "I didn't receive a response. Please try again.",
        createdAt: new Date(),
        toolsUsed: res.toolsUsed || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errMsg = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: `❌ **Error:** ${err.message || "Failed to communicate with AI server."}`,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "greeting",
        sender: "ai",
        text: `Welcome back! Ask me anything — I can look up policies, your training checklist, or available courses.`,
        createdAt: new Date(),
        toolsUsed: [],
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="w-[360px] md:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-default surface-elevated flex flex-col mb-4 overflow-hidden animate-slide-in">
          {/* Header */}
          <div
            className="px-4 py-3 flex justify-between items-center text-white select-none"
            style={{ background: "var(--dash-gradient)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                🤖
              </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">OnboardAI Assistant</h3>
                  <span className="text-[10px] text-teal-200 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse"></span>
                    Agent Mode
                  </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                title="Clear Chat"
                className="p-1.5 hover:bg-white/10 rounded transition text-xs opacity-90"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded transition text-sm font-bold"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-muted/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-teal-600 text-white rounded-tr-none"
                      : "bg-surface border border-default text-dash-ink dark:text-white rounded-tl-none shadow-sm"
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                />
                {msg.sender === "ai" && msg.toolsUsed && msg.toolsUsed.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {msg.toolsUsed.map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 font-mono"
                      >
                        🔧 {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">
                  AI
                </div>
                <div className="bg-surface border border-default text-muted rounded-xl px-3 py-2 text-sm rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <LoadingSpinner size="sm" className="text-teal-600" />
                  <span>Agent thinking...</span>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-default bg-surface flex gap-2">
            <input
              type="text"
              placeholder="Ask about guidelines, setup, policy..."
              className="flex-1 px-3 py-2 text-sm border border-default rounded-lg bg-surface text-dash-ink dark:text-white focus:outline-none focus:border-teal-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-105 transition-all text-white border border-white/10 cursor-pointer"
        style={{ background: "var(--dash-gradient)" }}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
