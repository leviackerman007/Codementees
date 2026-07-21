const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash";

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
      // AUTO lets Gemini decide whether to call a tool or respond directly
      toolConfig: {
        functionCallingConfig: { mode: "AUTO" },
      },
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

  // Surface safety blocks immediately rather than letting them silently fail
  if (data.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the request: ${data.promptFeedback.blockReason}`);
  }

  return data;
}

export function extractTextReply(geminiResponse) {
  const candidate = geminiResponse?.candidates?.[0];
  if (!candidate) return "";
  const parts = candidate?.content?.parts || [];
  return parts
    .filter((p) => p.text)
    .map((p) => p.text)
    .join("");
}

export function extractFunctionCall(geminiResponse) {
  const parts = geminiResponse?.candidates?.[0]?.content?.parts || [];
  const funcPart = parts.find((p) => p.functionCall);
  if (!funcPart) return null;
  return {
    name: funcPart.functionCall.name,
    args: funcPart.functionCall.args || {},
  };
}

export function getFinishReason(geminiResponse) {
  return geminiResponse?.candidates?.[0]?.finishReason || "UNKNOWN";
}

export function isValidApiKey(key) {
  return !!(key && key !== "AIzaSy..." && key.length > 20);
}
