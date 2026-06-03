import KnowledgeDocument from "../models/knowledge.model.js";

// Handle chat queries with RAG context from Gemini
export const handleRAGChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message query is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "AIzaSy...") {
      return res.json({
        success: true,
        reply: "⚠️ **Gemini API key is not configured.**\n\nPlease add a valid `GEMINI_API_KEY` in the backend `.env` file to enable live RAG chatbot replies.",
      });
    }

    // Step 1: Query database for context using MongoDB text index search
    let matchingDocs = [];
    try {
      matchingDocs = await KnowledgeDocument.find(
        { $text: { $search: message } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(3);
    } catch (dbError) {
      console.warn("DB search error, searching fallback titles:", dbError);
    }

    // If text index search yielded nothing, pull the 3 latest documents as general context
    if (matchingDocs.length === 0) {
      matchingDocs = await KnowledgeDocument.find().sort({ createdAt: -1 }).limit(3);
    }

    // Step 2: Format context details
    let contextStr = "";
    if (matchingDocs.length > 0) {
      contextStr = matchingDocs
        .map((doc, idx) => `[Document ${idx + 1}: ${doc.title}]\nCategory: ${doc.category}\nContent: ${doc.content}`)
        .join("\n\n");
    } else {
      contextStr = "No official company reference documents have been uploaded to the Knowledge Base yet.";
    }

    // Step 3: Construct conversation history context
    let historyStr = "";
    if (history && Array.isArray(history) && history.length > 0) {
      historyStr = "Conversation history:\n" + history
        .map((item) => `${item.sender === "user" ? "Employee" : "OnboardAI"}: ${item.text}`)
        .join("\n") + "\n";
    }

    // Step 4: Compile RAG prompt instructions
    const systemPrompt = `You are "OnboardAI", the intelligent corporate onboarding assistant for our company.
Your goal is to answer the employee's questions accurately, professionally, and clearly.

You must answer the query based strictly on the official company reference documents provided below.

===
Company Knowledge Base Reference:
${contextStr}
===

Rules:
1. Base your response strictly on the provided company reference documents.
2. If the answer cannot be found in the documents or if the documents are empty, politely state: "I don't have that information in my knowledge base. Please check with your Onboarding Manager or HR."
3. Do not make up facts, URLs, contacts, or use external knowledge outside the scope of the provided documents.
4. Keep the tone helpful, professional, and clear. Use bullet points or codeblocks if appropriate.
5. Avoid copying large text blocks verbatim from the source documents. Always rephrase the information and present it in your own words to prevent recitation filter blocking.

${historyStr}Employee Query: ${message}
OnboardAI:`;

    // Step 5: Send call to Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt }
            ]
          }
        ]
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Gemini API returned status ${apiResponse.status}: ${errorText}`);
    }

    const data = await apiResponse.json();
    
    // Extract reply text
    let reply = "";
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      reply = data.candidates[0].content.parts[0].text;
    } else {
      reply = "I encountered an issue generating a response. Please try again.";
    }

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("RAG Chat Error:", error);
    res.status(500).json({ success: false, message: "AI response failed", error: error.message });
  }
};
