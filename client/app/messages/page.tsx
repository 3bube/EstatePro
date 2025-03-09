"use client";

import { useState } from "react";
import { ConversationList } from "@/components/ConversationList";
import { ChatArea } from "@/components/ChatArea";
import { PropertySidebar } from "@/components/PropertySidebar";
import { getConversationForUser } from "@/api/message.api";
import { getPropertyById } from "@/api/property.api";
import { useQuery } from "@tanstack/react-query";

interface Conversation {
  _id: string;
  propertyId: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: string;
    sender: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Property {
  data: {
    title: string;
  };
}

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showPropertySidebar, setShowPropertySidebar] = useState(true);

  console.log(selectedConversation);

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => await getConversationForUser(),
    staleTime: 5 * 60 * 1000,
    select: (conversation: { data: Conversation[] }) => {
      return conversation.data;
    },
  });

  const { data: property } = useQuery({
    queryKey: ["property", selectedConversation?.propertyId],
    queryFn: async () =>
      await getPropertyById(selectedConversation?.propertyId),
    enabled: !!selectedConversation?.propertyId,
    select: (property: Property) => {
      return property.data;
    },
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <ConversationList
        conversations={conversations}
        onSelectConversation={setSelectedConversation}
        selectedConversationId={selectedConversation?._id}
      />
      <main className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatArea
            conversation={selectedConversation}
            onTogglePropertySidebar={() =>
              setShowPropertySidebar(!showPropertySidebar)
            }
            propertyTitle={property?.title}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </main>
      {showPropertySidebar && selectedConversation && (
        <PropertySidebar property={property} />
      )}
    </div>
  );
}
