import mongoose from "mongoose";
import { IConversation } from "../types/conversation.types";

const ConversationSchema = new mongoose.Schema<IConversation>({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: false,
  },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);

export default ConversationModel;
