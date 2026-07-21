import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "model"],
    required: true,
  },
  parts: [
    {
      text: { type: String, required: true },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationMemorySchema = new mongoose.Schema(
  {
    // One document per user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ConversationMemory", conversationMemorySchema);
