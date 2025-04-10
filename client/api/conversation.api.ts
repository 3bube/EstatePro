import api from "./api";

export interface Conversation {
  _id: string;
  participants: string[];
  propertyId?: string;
  messages: {
    _id: string;
    sender: string;
    content: string;
    timestamp: Date;
    read: boolean;
  }[];
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await api.get("/conversations");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const getConversation = async (id: string): Promise<Conversation> => {
  try {
    const response = await api.get(`/conversations/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching conversation ${id}:`, error);
    throw error;
  }
};
