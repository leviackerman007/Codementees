import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["hr", "technical", "benefits", "general"],
      default: "general",
    },
    fileName: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Add a text index for RAG searches
knowledgeSchema.index({ title: "text", content: "text" });

export default mongoose.model("KnowledgeDocument", knowledgeSchema);
