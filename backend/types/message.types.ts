import mongoose from "mongoose";

export interface IMessage {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  content: string;
  attachments?: string[]; // URLs to uploaded files
  read: boolean;
  createdAt: Date;
}
