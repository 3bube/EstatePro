import MessageModel from "../models/message.models";
import ConversationModel from "../models/conversation.models";
import { IMessage } from "../types/message.types";
import { IConversation } from "../types/conversation.types";
import { AppError } from "../utils/AppError";

interface IMessageData {
  recipientId: string;
  content: string;
  propertyId?: string;
}

export const createMessage = async (
  messageData: IMessage,
  propertyId: string,
  senderId: string
) => {
  try {
    const { recipientId, content } = messageData;

    // find exisitng conversation between sender and recipient
    let conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      // create new conversation
      conversation = await ConversationModel.create({
        participants: [senderId, recipientId],
        propertyId,
      });
    }

    console.log("creating message");

    const message = await MessageModel.create({
      conversation: conversation._id,
      sender: senderId,
      recipientId,
      content,
      read: false,
    });

    // update conversation with latest message
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    return message;
  } catch (error) {
    console.error("Error creating message:", error);
    throw new AppError("Failed to create message", 500);
  }
};

export const getConversationForUser = async (userId: string) => {
  try {
    const conversations = await ConversationModel.find({
      participants: userId,
    })
      .populate({
        path: "lastMessage",
        select: "content sender propertyId read",
        model: "Message",
      })
      .populate({
        path: "participants",
        select: "firstName lastName email phoneNumber role",
        model: "User",
      });
    return conversations;
  } catch (error) {
    throw new AppError("Failed to get conversations", 500);
  }
};

export const getMessagesForConversation = async (conversationId: string) => {
  try {
    const messages = await MessageModel.find({ conversation: conversationId })
      .populate("sender", "firstName lastName email phoneNumber role")
      .populate("recipientId", "firstName lastName email phoneNumber role");
    return messages;
  } catch (error) {
    throw new AppError("Failed to get messages", 500);
  }
};

export const readMessage = async (messageId: string, currentUserId: string) => {
  try {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    
    // Only mark as read if the current user is the recipient
    if (message.recipientId.toString() === currentUserId) {
      message.read = true;
      await message.save();
      console.log("message marked as read", message);
    } else {
      console.log("User is not the recipient of this message");
    }
    
    return message;
  } catch (error) {
    throw new AppError("Failed to read message", 500);
  }
};
