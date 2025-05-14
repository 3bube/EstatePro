import api from "./api";

export interface SendMessageInput {
  recipientId: string;
  propertyId?: string;
  content: string;
  type?: "text" | "visit";
}

export const sendMessage = async ({
  recipientId,
  propertyId,
  content,
  type = "text",
}: SendMessageInput) => {
  try {
    const response = await api.post("/messages/send-message", {
      recipientId,
      propertyId,
      type,
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

export const markMessageAsRead = async (messageIds: string | string[]) => {
  try {
    const response = await api.patch(`/messages/${messageIds}`);

    return response.data;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};


// fetch conversations for user
export const fetchConversations = async () => {
  try {
    const response = await api.get("/messages");
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};
  