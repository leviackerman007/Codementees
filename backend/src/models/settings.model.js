import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // Always query with { key: "global" } — there's only one settings document
    key: {
      type: String,
      default: "global",
      unique: true,
    },
    aiSystemPrompt: {
      type: String,
      default:
        "You are OnboardAI, a professional and helpful corporate onboarding assistant. Answer questions clearly, concisely, and with a friendly tone. Always prioritize information from the company knowledge base.",
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
