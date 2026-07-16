import { runOnboardingAgent } from "../agents/onboardingAgent.js";

/**
 * POST /api/ai/chat
 * Thin controller — authenticates user, delegates to the agent orchestrator.
 */
export const handleAgentChat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const userId = req.user._id;

    const result = await runOnboardingAgent({
      message: message.trim(),
      userId,
    });

    return res.json({
      success: true,
      reply: result.reply,
      toolsUsed: result.toolsUsed,
      executionMs: result.executionMs,
    });
  } catch (error) {
    next(error);
  }
};
