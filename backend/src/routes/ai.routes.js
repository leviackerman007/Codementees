import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { handleAgentChat } from "../controllers/ai.controller.js";

const router = express.Router();

// Require authentication for AI chat endpoint
router.use(protect);

// POST /api/ai/chat - Query the Onboarding Agent
router.post("/chat", handleAgentChat);

export default router;
