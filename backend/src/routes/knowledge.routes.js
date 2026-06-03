import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import * as knowledgeController from "../controllers/knowledge.controller.js";

const router = express.Router();

// Require authentication for all knowledge routes
router.use(protect);

// GET /api/knowledge - Retrieve documents (accessible by all authenticated employees)
router.get("/", knowledgeController.getDocuments);

// POST /api/knowledge/upload - Upload text/markdown documents (Managers & Admins only)
router.post("/upload", restrictTo("mentor", "admin"), knowledgeController.uploadDocument);

// DELETE /api/knowledge/:id - Delete a document (Managers & Admins only)
router.delete("/:id", restrictTo("mentor", "admin"), knowledgeController.deleteDocument);

export default router;
