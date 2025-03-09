import mongoose from "mongoose";

export interface IConversation {
  participants: mongoose.Types.ObjectId[]; // References to Users
  property?: mongoose.Types.ObjectId; // Reference to Property (if applicable)
  propertyId?: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId; // Reference to last Message
  unreadCount: {
    [userId: string]: number; // Count of unread messages for each participant
  };
  createdAt: Date;
  updatedAt: Date;
}
