import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
   messages: [
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    role: String,
    message: String
  }
],
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },
    adminReply: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ Proper model export
const Support = mongoose.model("Support", supportSchema);

export default Support;