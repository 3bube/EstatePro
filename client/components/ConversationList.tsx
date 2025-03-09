import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { markMessageAsRead } from "@/api/message.api";

type Conversation = {
  _id: string;
  contactName: string;
  propertyThumbnail?: string;
  lastMessage: {
    _id: string;
    sender: string;
    content: string;
    read: boolean;
  };
  participants: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

type ConversationListProps = {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId: string | null;
};

export function ConversationList({
  conversations,
  onSelectConversation,
  selectedConversationId,
}: ConversationListProps) {
  const { user } = useAuth();

  const markMessageAsReadMutation = useMutation({
    mutationFn: (messageId: string) => markMessageAsRead(messageId),
  });

  const handleConversationClick = async (conversation: Conversation) => {
    onSelectConversation(conversation);
    
    // Only mark message as read if the current user is not the sender
    // (which means they are the recipient)
    if (conversation.lastMessage && conversation.lastMessage.sender !== user._id) {
      await markMessageAsReadMutation.mutateAsync(conversation.lastMessage._id);
    }
  };

  const getConversationName = (conversation: Conversation) => {
    // map through the participants and find the participant that is not the current user
    const otherParticipant = conversation.participants.find(
      (participant) => participant._id !== user._id
    )!;

    return `${otherParticipant.firstName} ${otherParticipant.lastName}`;
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-[#2C3E50]">Messages</h2>
      </div>
      <ul>
        {conversations?.map((conversation) => (
          <li
            key={conversation._id}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              selectedConversationId === conversation._id ? "bg-gray-100" : ""
            }`}
            onClick={() => handleConversationClick(conversation)}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={getConversationName(conversation)} />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {getConversationName(conversation)}
                  </h3>
                  <span className="text-xs text-gray-500 truncate">
                    {new Date(conversation.updatedAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage?.content}
                </p>
              </div>
              {/* Only show unread indicator if current user is the recipient (not the sender) and message is unread */}
              {!conversation.lastMessage?.read && conversation.lastMessage?.sender !== user._id && (
                <span className="ml-2 inline-block w-2 h-2 bg-[#E74C3C] rounded-full"></span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
