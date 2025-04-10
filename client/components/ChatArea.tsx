import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMessagesForConversation,
  sendMessage,
  markMessageAsRead,
} from "@/api/message.api";
import { updateVisitStatus } from "@/api/property.api";
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
  type?: "text" | "visit";
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
  showButtons: boolean;
};

export function ChatArea({
  conversation,
  onTogglePropertySidebar,
  propertyTitle,
  showButtons,
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

  // Use useMemo to prevent messages from changing on every render
  const messages = useMemo(() => messagesData?.data ?? [], [messagesData]);

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      sendMessage({
        recipientId: getOtherParticipant()?._id || "",
        propertyId: conversation.propertyId,
        content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversation._id],
      });
      setNewMessage("");
    },
  });

  const markMessageReadMutation = useMutation({
    mutationFn: (messageIds: string[]) => markMessageAsRead(messageIds),
  });

  const updateVisitStatusMutation = useMutation({
    mutationFn: ({
      propertyId,
      userId,
      scheduledDate,
      status,
    }: {
      propertyId: string;
      userId: string;
      scheduledDate: Date;
      status: "accepted" | "declined";
    }) => updateVisitStatus(propertyId, userId, scheduledDate, status),
    onSuccess: () => {
      // Refresh messages to show updated status
      queryClient.invalidateQueries({
        queryKey: ["messages", conversation._id],
      });
    },
  });

  // Only process unread messages when the conversation changes or when messages are first loaded
  useEffect(() => {
    // Only run if we have messages and query was successful
    if (!isSuccess || !messages.length || !conversation?._id || !user) {
      return;
    }

    // Create a user ID variable that won't be null
    const userId = user._id;

    // Check if conversation has changed
    const isNewConversation =
      previousConversationId.current !== conversation._id;

    // If conversation changed, clear processed messages
    if (isNewConversation) {
      processedMessageIds.current.clear();
      previousConversationId.current = conversation._id;
    }

    // Find unread messages where user is recipient and not already processed
    const unreadMessages = messages.filter(
      (message: Message) =>
        !message.read &&
        message.sender._id !== userId &&
        !processedMessageIds.current.has(message._id)
    );

    // If no unread messages, exit early
    if (!unreadMessages.length) {
      return;
    }

    // Process each unread message only once
    const processUnreadMessages = async () => {
      // Create a list of message IDs to mark as read
      const messageIdsToProcess = unreadMessages.map((msg: Message) => msg._id);

      // Mark all IDs as processed to prevent future processing
      messageIdsToProcess.forEach((id: string) => {
        processedMessageIds.current.add(id);
      });

      // Call API to mark messages as read
      try {
        await markMessageReadMutation.mutateAsync(messageIdsToProcess);

        // Invalidate query to refresh messages
        queryClient.invalidateQueries({
          queryKey: ["messages", conversation._id],
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    processUnreadMessages();

    // Clean up function
    return () => {
      // No cleanup needed here
    };
  }, [
    conversation?._id,
    isSuccess,
    messages,
    queryClient,
    user,
    markMessageReadMutation,
  ]); // Added markMessageReadMutation

  const VisitButtons = ({ message }: { message: Message }) => {
    const handleVisitResponse = (status: "accepted" | "declined") => {
      // Check if we have all the required data
      if (!conversation?.propertyId || !message.sender._id) {
        console.error("Missing required data for visit response");
        return;
      }

      // Try to extract the date using different patterns
      let scheduledDate: Date | null = null;

      // First try ISO format (YYYY-MM-DD)
      const isoDateRegex = /\b\d{4}-\d{2}-\d{2}\b/;
      const isoMatch = message.content.match(isoDateRegex);

      if (isoMatch) {
        scheduledDate = new Date(isoMatch[0]);
      } else {
        // Try to extract month name format (e.g., "April 10, 2025")
        const monthNameRegex =
          /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,\s+(\d{4})\b/i;
        const monthMatch = message.content.match(monthNameRegex);

        if (monthMatch) {
          const [, month, day, year] = monthMatch;
          const dateStr = `${month} ${day}, ${year}`;
          scheduledDate = new Date(dateStr);
        }
      }

      // If we still don't have a valid date, try to use the current date
      if (!scheduledDate || isNaN(scheduledDate.getTime())) {
        console.error(
          "Could not extract a valid date from message:",
          message.content
        );

        // As a fallback, use today's date
        scheduledDate = new Date();
        console.log(
          "Using fallback date (today):",
          scheduledDate.toISOString()
        );
      }

      console.log("Updating visit status:", {
        propertyId: conversation.propertyId,
        userId: message.sender._id,
        scheduledDate,
        status,
      });

      updateVisitStatusMutation.mutate({
        propertyId: conversation.propertyId,
        userId: message.sender._id,
        scheduledDate,
        status,
      });
    };

    return (
      <div className="flex space-x-2 mt-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          onClick={() => handleVisitResponse("accepted")}
          disabled={updateVisitStatusMutation.isPending}
        >
          Accept
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          onClick={() => handleVisitResponse("declined")}
          disabled={updateVisitStatusMutation.isPending}
        >
          Decline
        </button>
      </div>
    );
  };

  const getOtherParticipant = () => {
    if (!user || !conversation?.participants) return null;

    return conversation.participants.find(
      (participant) => participant._id !== user._id
    );
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessageMutation.mutate(newMessage);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCurrentUserMessage = (message: Message) => {
    if (!user) return false;
    return message.sender._id === user._id;
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="font-medium">
              {getOtherParticipant()?.firstName}{" "}
              {getOtherParticipant()?.lastName}
            </p>
            <p className="text-sm text-gray-500">{propertyTitle}</p>
          </div>
        </div>
        <button
          onClick={onTogglePropertySidebar}
          className="text-gray-600 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message._id}
            className={`flex ${
              isCurrentUserMessage(message) ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                isCurrentUserMessage(message)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <p>{message.content}</p>
              {message.type === "visit" && !showButtons && (
                <VisitButtons message={message} />
              )}
              <p
                className={`text-xs mt-1 ${
                  isCurrentUserMessage(message)
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex items-center">
          <button className="text-gray-500 hover:text-gray-700 mr-2">
            <PaperClipIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
