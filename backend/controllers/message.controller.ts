import { Response } from "express";
import { catchAsync, AuthenticatedRequest } from "../utils/handler";
import {
  createMessage,
  getConversationForUser,
  getMessagesForConversation,
  readMessage,
} from "../services/message.services";
import { IMessage } from "../types/message.types";

export const sendMessage = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { recipientId, content, propertyId } = req.body;

      console.log(recipientId, content);
      const senderId = req.user.id;
      const message = await createMessage(
        { recipientId, content } as IMessage,
        propertyId,
        senderId
      );
      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export const getUserConversation = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.id;
      console.log(userId);
      const conversations = await getConversationForUser(userId);
      res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export const getConversationMessages = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const conversationId = req.params.id;
      const messages = await getMessagesForConversation(conversationId);
      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export const markMessageAsRead = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const messageId = req.params.id;
      const currentUserId = req.user._id.toString();

      const message = await readMessage(messageId, currentUserId);

      res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);
