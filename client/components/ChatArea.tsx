import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessagesForConversation, sendMessage, markMessageAsRead } from "@/api/message.api";
import { useAuth } from "@/context/AuthContext";
import {
  Paperclip as PaperClipIcon,
  PlaneIcon as PaperAirplaneIcon,
} from "lucide-react";

type Message = {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  recipientId: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  content: string;
  createdAt: string;
  read: boolean;
};

type ChatAreaProps = {
  conversation: {
    _id: string;
    participants: {
      _id: string;
      firstName: string;
      lastName: string;
    }[];
    propertyId: string;
  };
  onTogglePropertySidebar: () => void;
  propertyTitle: string;
};

export function ChatArea({
  conversation,
  onTogglePropertySidebar,
  propertyTitle,
}: ChatAreaProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();
  
  // Store conversation ID to detect changes
  const previousConversationId = useRef<string | null>(null);
  // Store processed message IDs
  const processedMessageIds = useRef<Set<string>>(new Set());

  const { data: messagesData, isSuccess } = useQuery({
    queryKey: ["messages", conversation?._id],
    queryFn: () => getMessagesForConversation(conversation?._id),
    enabled: !!conversation?._id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      sendMessage({
        recipientId: getOtherParticipant()?._id ?? "",
        propertyId: conversation?.propertyId ?? "",
        content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversation?._id],
      });
    },
  });

  const markMessageReadMutation = useMutation({
    mutationFn: (messageId: string) => markMessageAsRead(messageId),
  });

  const messages = messagesData?.data ?? [];

  // Only process unread messages when the conversation changes or when messages are first loaded
  useEffect(() => {
    // Only run if we have messages and query was successful
    if (!isSuccess || !messages.length || !conversation?._id || !user?._id) {
      return;
    }

    // Check if conversation has changed
    const isNewConversation = previousConversationId.current !== conversation._id;
    
    // If conversation changed, clear processed messages
    if (isNewConversation) {
      processedMessageIds.current.clear();
      previousConversationId.current = conversation._id;
    }

    // Find unread messages where user is recipient and not already processed
    const unreadMessages = messages.filter(
      (message: Message) => 
        !message.read && 
        message.sender._id !== user._id &&
        !processedMessageIds.current.has(message._id)
    );

    // If no unread messages, exit early
    if (!unreadMessages.length) {
      return;
    }

    // Process each unread message only once
    const processUnreadMessages = async () => {
      // Create a list of message IDs to mark as read
      const messageIdsToProcess = unreadMessages.map(msg => msg._id);
      
      // Mark all IDs as processed to prevent future processing
      messageIdsToProcess.forEach(id => {
        processedMessageIds.current.add(id);
      });
      
      // Only mark the last message as read to reduce API calls
      // This is a common pattern in messaging apps
      const lastMessageId = messageIdsToProcess[messageIdsToProcess.length - 1];
      
      try {
        await markMessageReadMutation.mutateAsync(lastMessageId);
        // Refresh messages after marking as read
        queryClient.invalidateQueries({
          queryKey: ["messages", conversation._id],
        });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    };

    // Execute the function
    processUnreadMessages();
    
    // Clean up function
    return () => {
      // No cleanup needed here
    };
  }, [conversation?._id, isSuccess]); // Only depend on conversation ID and query success

  const getOtherParticipant = () => {
    return conversation?.participants?.find(
      (participant) => participant._id !== user._id
    );
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log(newMessage);
      sendMessageMutation.mutate(newMessage);
      setNewMessage("");
    }
  };

  const otherParticipant = getOtherParticipant();

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#2C3E50]">
            {otherParticipant
              ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
              : ""}
          </h2>
          <p className="text-sm text-gray-500">{propertyTitle}</p>
        </div>
        <button
          onClick={onTogglePropertySidebar}
          className="text-[#2C3E50] hover:text-[#E74C3C]"
        >
          Toggle Property Details
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender._id === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.sender._id === user._id
                  ? "bg-[#2C3E50] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{message.content}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs opacity-75">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.sender._id === user._id && (
                  <span className="text-xs opacity-75">
                    {message.read ? "Read" : "Delivered"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center">
          <button className="text-gray-500 hover:text-[#2C3E50] mr-2">
            <PaperClipIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-[#2C3E50] text-white rounded-full p-2 hover:bg-[#34495E]"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}
