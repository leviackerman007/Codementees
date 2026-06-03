import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import KnowledgeDocument from "../models/knowledge.model.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload and index a text/markdown file
export const uploadDocument = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const file = req.files.file;
    const title = req.body.title || file.name.replace(/\.[^/.]+$/, "");
    const category = req.body.category || "general";

    // Read the text content of the file
    let content = "";
    if (file.tempFilePath) {
      content = await fs.readFile(file.tempFilePath, "utf8");
    } else if (file.data) {
      content = file.data.toString("utf8");
    } else {
      return res.status(400).json({ success: false, message: "Could not read file data" });
    }

    if (!content.trim()) {
      return res.status(400).json({ success: false, message: "Uploaded file is empty" });
    }

    // Upload backup file copy to Cloudinary (resource_type auto)
    let fileUrl = "";
    try {
      if (file.tempFilePath) {
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "codementees/knowledge",
          resource_type: "raw", // use raw for text/md files in Cloudinary
        });
        fileUrl = uploadResult.secure_url;
      }
    } catch (uploadError) {
      console.warn("Cloudinary upload failed (continuing with DB insertion):", uploadError);
    }

    // Save document to DB
    const newDoc = await KnowledgeDocument.create({
      title,
      content,
      category,
      fileName: file.name,
      fileUrl,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded and indexed successfully",
      document: newDoc,
    });
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({ success: false, message: "Failed to upload document", error: error.message });
  }
};

// Retrieve documents (supports search and category filtering)
export const getDocuments = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      // Use text index search
      filter.$text = { $search: search };
    }

    // Query DB
    let query = KnowledgeDocument.find(filter);

    if (search) {
      // Sort by text relevance score
      query = query.select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
    } else {
      // Default to latest
      query = query.sort({ createdAt: -1 });
    }

    const documents = await query.populate("uploadedBy", "name email");

    res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ success: false, message: "Failed to load documents", error: error.message });
  }
};

// Delete an indexed document
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await KnowledgeDocument.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Delete from MongoDB
    await KnowledgeDocument.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Document deleted from knowledge index successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ success: false, message: "Failed to delete document", error: error.message });
  }
};
