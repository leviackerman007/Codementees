import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { handleRAGChat } from "../controllers/ai.controller.js";

const router = express.Router();

// Require authentication for AI chat endpoint
router.use(protect);

// POST /api/ai/chat - Prompt the RAG assistant
router.post("/chat", handleRAGChat);

export default router;
