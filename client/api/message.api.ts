import api from "./api";

export interface SendMessageInput {
  recipientId: string;
  propertyId?: string;
  content: string;
}

export const sendMessage = async ({
  recipientId,
  propertyId,
  content,
}: SendMessageInput) => {
  try {
    const response = await api.post("/conversations/send-message", {
      recipientId,
      propertyId,
      content,
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getConversationForUser = async () => {
  try {
    const response = await api.get("/messages");
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const getMessagesForConversation = async (conversationId: string) => {
  try {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const response = await api.patch(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Error reading message:", error);
    throw error;
  }
};
