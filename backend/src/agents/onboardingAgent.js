/**
 * onboardingAgent.js
 *
 * The core Agentic AI orchestrator for OnboardAI.
 *
 * Architecture:
 *   1. Load conversation memory from MongoDB
 *   2. Declare tools to Gemini via Function Calling API
 *   3. Send user query → Gemini decides which tools to call
 *   4. Execute tool(s) → append results → call Gemini again
 *   5. Loop until Gemini returns a final text response
 *   6. Persist updated memory to MongoDB
 *   7. Return { reply, toolsUsed, executionMs }
 */

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

// ─── Tool Registry ────────────────────────────────────────────────────────────
// Maps function names (as declared to Gemini) to their implementations.
// To add a new tool: import it and add an entry here. No other changes needed.
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

// Max Gemini agentic loop iterations to prevent infinite loops
const MAX_ITERATIONS = 6;

/**
 * Run the Onboarding Agent for a given user message.
 *
 * @param {{ message: string, userId: string }} params
 * @returns {Promise<{ reply: string, toolsUsed: string[], executionMs: number }>}
 */
export async function runOnboardingAgent({ message, userId }) {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  // ── API key guard ──────────────────────────────────────────────────────────
  if (!isValidApiKey(apiKey)) {
    return {
      reply:
        "⚠️ **Gemini API key is not configured.** Please add a valid `GEMINI_API_KEY` in the backend `.env` file.",
      toolsUsed: [],
      executionMs: 0,
    };
  }

  // ── Load admin system prompt from Settings ─────────────────────────────────
  let adminSystemPrompt = "";
  try {
    const settings = await Settings.findOne({ key: "global" }).lean();
    adminSystemPrompt = settings?.aiSystemPrompt || "";
  } catch (err) {
    console.warn("[Agent] Failed to load settings:", err.message);
  }

  // ── Build system instruction ───────────────────────────────────────────────
  const systemInstruction = `${adminSystemPrompt}

You are OnboardAI, a professional corporate onboarding assistant.
You have access to a set of tools that query real company data from the database.
Always use the appropriate tools to retrieve accurate information before answering.
Never fabricate information — if a tool returns no data, say so honestly.
Keep responses clear, professional, and concise.
When relevant, present information using bullet points or numbered lists.`;

  // ── Load conversation memory (last 10 turns) ───────────────────────────────
  let memoryDoc = null;
  let previousMessages = [];
  try {
    memoryDoc = await ConversationMemory.findOne({ user: userId });
    if (memoryDoc?.messages?.length > 0) {
      previousMessages = memoryDoc.messages.slice(-10).map((m) => ({
        role: m.role,
        parts: m.parts,
      }));
    }
  } catch (err) {
    console.warn("[Agent] Memory load failed:", err.message);
  }

  // ── Build initial conversation contents ───────────────────────────────────
  const contents = [
    ...previousMessages,
    { role: "user", parts: [{ text: message }] },
  ];

  // ── Agentic Loop ───────────────────────────────────────────────────────────
  const toolsUsed = [];
  let iterations = 0;
  let finalReply = "";

  try {
    while (iterations < MAX_ITERATIONS) {
      iterations++;
      const loopStart = Date.now();

      console.log(`[Agent] Iteration ${iterations}: calling Gemini...`);
      const geminiResponse = await callGemini({
        apiKey,
        contents,
        toolDeclarations: TOOL_DECLARATIONS,
        systemInstruction,
      });

      console.log(`[Agent] Gemini responded in ${Date.now() - loopStart}ms`);

      // Check if Gemini wants to call a function
      const functionCall = extractFunctionCall(geminiResponse);

      if (functionCall) {
        const { name, args } = functionCall;
        console.log(`[Agent] Tool requested: ${name}`, args);
        toolsUsed.push(name);

        // Append Gemini's function call turn
        contents.push({
          role: "model",
          parts: [{ functionCall: { name, args } }],
        });

        // Execute the tool
        let toolResult;
        const toolFn = TOOL_REGISTRY[name];
        if (toolFn) {
          try {
            const toolStart = Date.now();
            toolResult = await toolFn({ ...args, userId: String(userId) });
            console.log(`[Agent] Tool ${name} completed in ${Date.now() - toolStart}ms`);
          } catch (toolErr) {
            console.error(`[Agent] Tool ${name} failed:`, toolErr.message);
            toolResult = { error: `Tool ${name} encountered an error: ${toolErr.message}` };
          }
        } else {
          toolResult = { error: `Unknown tool: ${name}` };
        }

        // Append tool result to conversation
        contents.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name,
                response: { result: JSON.stringify(toolResult) },
              },
            },
          ],
        });

        // Continue loop — Gemini may call more tools or produce final answer
        continue;
      }

      // No function call — Gemini has a final text response
      finalReply = extractTextReply(geminiResponse);
      break;
    }

    if (!finalReply) {
      finalReply =
        "I was unable to generate a complete response. Please try rephrasing your question.";
    }
  } catch (err) {
    console.error("[Agent] Agentic loop error:", err.message);
    finalReply = `I encountered an error while processing your request. Please try again. (${err.message})`;
  }

  // ── Persist memory ─────────────────────────────────────────────────────────
  try {
    const newMessages = [
      { role: "user", parts: [{ text: message }], timestamp: new Date() },
      { role: "model", parts: [{ text: finalReply }], timestamp: new Date() },
    ];

    if (memoryDoc) {
      // Keep only last 20 messages to prevent unbounded growth
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
    console.warn("[Agent] Memory persist failed:", err.message);
  }

  const executionMs = Date.now() - startTime;
  console.log(
    `[Agent] Done. Tools: [${toolsUsed.join(", ")}] | Total: ${executionMs}ms`
  );

  return { reply: finalReply, toolsUsed, executionMs };
}
