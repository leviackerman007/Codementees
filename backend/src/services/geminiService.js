/**
 * geminiService.js
 *
 * Centralized Gemini API communication layer.
 * All requests to the Gemini REST API go through this service.
 */

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash";

/**
 * Send a request to Gemini with Function Calling support.
 * Returns the raw response object (candidates array).
 *
 * @param {string} apiKey
 * @param {Array} contents - Gemini-format conversation array
 * @param {Array} toolDeclarations - Array of Gemini function declarations
 * @param {string} [systemInstruction] - Optional system prompt text
 */
export async function callGemini({ apiKey, contents, toolDeclarations = [], systemInstruction = "" }) {
  const url = `${GEMINI_BASE}:generateContent?key=${apiKey}`;

  const body = {
    contents,
    ...(systemInstruction && {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
    }),
    ...(toolDeclarations.length > 0 && {
      tools: [{ functionDeclarations: toolDeclarations }],
    }),
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Extract the text reply from a Gemini response.
 * @param {Object} geminiResponse
 * @returns {string}
 */
export function extractTextReply(geminiResponse) {
  const candidate = geminiResponse?.candidates?.[0];
  if (!candidate) return "";
  const parts = candidate?.content?.parts || [];
  return parts
    .filter((p) => p.text)
    .map((p) => p.text)
    .join("");
}

/**
 * Check if Gemini's response contains a function call request.
 * @param {Object} geminiResponse
 * @returns {{ name: string, args: Object } | null}
 */
export function extractFunctionCall(geminiResponse) {
  const parts = geminiResponse?.candidates?.[0]?.content?.parts || [];
  const funcPart = parts.find((p) => p.functionCall);
  if (!funcPart) return null;
  return {
    name: funcPart.functionCall.name,
    args: funcPart.functionCall.args || {},
  };
}

/**
 * Check if the API key is valid (not placeholder).
 * @param {string} key
 * @returns {boolean}
 */
export function isValidApiKey(key) {
  return !!(key && key !== "AIzaSy..." && key.length > 20);
}
