import ConversationMemory from "../models/conversationMemory.model.js";
import Settings from "../models/settings.model.js";
import {
  callGemini,
  extractTextReply,
  extractFunctionCall,
  isValidApiKey,
} from "../services/geminiService.js";
import { searchPolicies, searchPoliciesDeclaration } from "../tools/searchPolicies.js";
import { getEmployeeProfile, getEmployeeProfileDeclaration } from "../tools/getEmployeeProfile.js";
import { getAssignedMentor, getAssignedMentorDeclaration } from "../tools/getAssignedMentor.js";
import { getChecklist, getChecklistDeclaration } from "../tools/getChecklist.js";
import { getTrainingModules, getTrainingModulesDeclaration } from "../tools/getTrainingModules.js";

// Tool registry — maps Gemini function names to their actual implementations.
// Adding a new tool just means importing it and dropping it in here.
const TOOL_REGISTRY = {
  searchPolicies,
  getEmployeeProfile,
  getAssignedMentor,
  getChecklist,
  getTrainingModules,
};

const TOOL_DECLARATIONS = [
  searchPoliciesDeclaration,
  getEmployeeProfileDeclaration,
  getAssignedMentorDeclaration,
  getChecklistDeclaration,
  getTrainingModulesDeclaration,
];

// Safety cap to avoid runaway loops if something goes wrong
const MAX_ITERATIONS = 6;

export async function runOnboardingAgent({ message, userId }) {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!isValidApiKey(apiKey)) {
    return {
      reply: "⚠️ **Gemini API key is not configured.** Please add a valid `GEMINI_API_KEY` in the backend `.env` file.",
      toolsUsed: [],
      executionMs: 0,
    };
  }

  // Pull the admin-configured system prompt if one exists
  let adminSystemPrompt = "";
  try {
    const settings = await Settings.findOne({ key: "global" }).lean();
    adminSystemPrompt = settings?.aiSystemPrompt || "";
  } catch (err) {
    console.warn("[Agent] Could not load settings:", err.message);
  }

  const systemInstruction = `${adminSystemPrompt}

You are OnboardAI, a professional corporate onboarding assistant.
You have access to tools that query real company data from the database.
Always use the appropriate tools before answering — never make up information.
If a tool returns no data, be honest about it.
Keep responses clear and concise. Use bullet points where it helps readability.`;

  // Load the last 10 messages so the agent has conversation context
  let memoryDoc = null;
  let previousMessages = [];
  try {
    memoryDoc = await ConversationMemory.findOne({ user: userId });
    if (memoryDoc?.messages?.length > 0) {
      previousMessages = memoryDoc.messages.slice(-10).map((m) => ({
        role: m.role,
        // Mongoose adds _id to subdoc arrays — strip it so Gemini doesn't reject the payload
        parts: m.parts.map((p) => ({ text: p.text })),
      }));
    }
  } catch (err) {
    console.warn("[Agent] Memory load failed, continuing without history:", err.message);
  }

  const contents = [
    ...previousMessages,
    { role: "user", parts: [{ text: message }] },
  ];

  const toolsUsed = [];
  let iterations = 0;
  let finalReply = "";

  try {
    while (iterations < MAX_ITERATIONS) {
      iterations++;
      const loopStart = Date.now();

      console.log(`[Agent] Iteration ${iterations}: sending to Gemini...`);
      const geminiResponse = await callGemini({
        apiKey,
        contents,
        toolDeclarations: TOOL_DECLARATIONS,
        systemInstruction,
      });

      console.log(`[Agent] Gemini responded in ${Date.now() - loopStart}ms`);

      const finishReason = geminiResponse?.candidates?.[0]?.finishReason;
      console.log(`[Agent] Finish reason: ${finishReason}`);

      if (!geminiResponse?.candidates?.length) {
        console.error("[Agent] Empty candidates from Gemini:", JSON.stringify(geminiResponse));
        finalReply = "I received an unexpected response from the AI. Please try again.";
        break;
      }

      const functionCall = extractFunctionCall(geminiResponse);

      if (functionCall) {
        const { name, args } = functionCall;
        console.log(`[Agent] Running tool: ${name}`, args);
        toolsUsed.push(name);

        // Append Gemini's function call turn to the conversation
        contents.push({
          role: "model",
          parts: [{ functionCall: { name, args } }],
        });

        let toolResult;
        const toolFn = TOOL_REGISTRY[name];
        if (toolFn) {
          try {
            const toolStart = Date.now();
            toolResult = await toolFn({ ...args, userId: String(userId) });
            console.log(`[Agent] ${name} finished in ${Date.now() - toolStart}ms`);
          } catch (toolErr) {
            console.error(`[Agent] ${name} threw an error:`, toolErr.message);
            // Keep going with other tools rather than crashing the whole request
            toolResult = { error: `${name} failed: ${toolErr.message}` };
          }
        } else {
          toolResult = { error: `No implementation found for tool: ${name}` };
        }

        // Send tool result back so Gemini can continue reasoning
        contents.push({
          role: "function",
          parts: [
            {
              functionResponse: {
                name,
                response: { result: JSON.stringify(toolResult) },
              },
            },
          ],
        });

        continue;
      }

      // No function call means Gemini has a final answer ready
      finalReply = extractTextReply(geminiResponse);
      break;
    }

    if (!finalReply) {
      finalReply = "I was unable to generate a complete response. Please try rephrasing your question.";
    }
  } catch (err) {
    console.error("[Agent] Loop error:", err.message);
    finalReply = `Something went wrong while processing your request. Please try again. (${err.message})`;
  }

  // Save this conversation turn to memory for next time
  try {
    const newMessages = [
      { role: "user", parts: [{ text: message }], timestamp: new Date() },
      { role: "model", parts: [{ text: finalReply }], timestamp: new Date() },
    ];

    if (memoryDoc) {
      const trimmed = [...memoryDoc.messages, ...newMessages].slice(-20);
      await ConversationMemory.findByIdAndUpdate(memoryDoc._id, {
        messages: trimmed,
        updatedAt: new Date(),
      });
    } else {
      await ConversationMemory.create({
        user: userId,
        messages: newMessages,
      });
    }
  } catch (err) {
    console.warn("[Agent] Could not save memory:", err.message);
  }

  const executionMs = Date.now() - startTime;
  console.log(`[Agent] Done. Tools used: [${toolsUsed.join(", ")}] | ${executionMs}ms total`);

  return { reply: finalReply, toolsUsed, executionMs };
}
