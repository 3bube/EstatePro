import mongoose from "mongoose";
import { IMessage } from "../types/message.types";

const MessageSchema = new mongoose.Schema<IMessage>({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: { type: String, enum: ["text", "visit"], default: "text" },
  content: { type: String, required: true },
  attachments: { type: [String], required: false },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
