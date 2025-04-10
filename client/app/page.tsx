"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { WelcomeSection } from "@/components/WelcomeSection";
import { RecommendedProperties } from "@/components/RecommendedProperties";
import { SavedSearches } from "@/components/SavedSearches";
import { ListingStats } from "@/components/ListingStats";
import { useAuth } from "@/context/AuthContext";
import { getProperties } from "@/api/property.api";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, MessageSquare, Home } from "lucide-react";

// Define interfaces for our data structures
interface Visit {
  user: string;
  scheduledDate: Date | string;
  status: "accepted" | "declined" | "pending";
  notes?: string;
  createdAt?: Date | string;
}

interface Property {
  _id: string;
  title: string;
  images: string[];
  scheduledVisits?: Visit[];
}

// Define an interface for the upcoming visit data
interface UpcomingVisit {
  propertyId: string;
  propertyTitle: string;
  scheduledDate: Date;
}

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  _id: string;
  participants: string[];
  propertyId?: string;
  messages: Message[];
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Simplified conversation API function for the dashboard
const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await fetch('/api/conversations');
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [userType, setUserType] = useState<"seeker" | "realtor">("seeker");

  useEffect(() => {
    if (user?.role === "buyer" || user?.role === "renter") {
      setUserType("seeker");
    } else if (user?.role) {
      setUserType("realtor");
    }
  }, [user?.role]);

  // Fetch conversations
  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: getConversations,
    enabled: !!user,
  });

  // Fetch properties
  const { data: properties } = useQuery<{ data: Property[] }>({
    queryKey: ["properties"],
    queryFn: getProperties,
    enabled: !!user,
  });

  // Calculate stats
  const unreadMessagesCount = conversations?.filter(
    (convo: Conversation) => convo.unreadCount > 0
  ).length || 0;
  
  const pendingVisitsCount = properties?.data?.filter(
    (property: Property) => 
      property.scheduledVisits && 
      property.scheduledVisits.some((visit: Visit) => visit.status === "pending")
  ).length || 0;
  
  const acceptedVisitsCount = properties?.data?.filter(
    (property: Property) => 
      property.scheduledVisits && 
      property.scheduledVisits.some((visit: Visit) => visit.status === "accepted")
  ).length || 0;

  // Format upcoming visit dates
  const upcomingVisits: UpcomingVisit[] = properties?.data
    ?.flatMap((property: Property) => 
      property.scheduledVisits
        ?.filter((visit: Visit) => visit.status === "accepted")
        .map((visit: Visit) => ({
          propertyId: property._id,
          propertyTitle: property.title,
          scheduledDate: new Date(visit.scheduledDate),
        })) || []
    )
    .filter((visit: UpcomingVisit) => visit.scheduledDate > new Date())
    .sort((a: UpcomingVisit, b: UpcomingVisit) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
    .slice(0, 3) || [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar userType={userType} />
      <main className="flex-1 p-8">
        <WelcomeSection userName={user?.firstName || ""} />
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Messages</h3>
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{conversations?.length || 0}</p>
              <div className="flex mt-2">
                {unreadMessagesCount > 0 && (
                  <Badge className="bg-red-500">
                    {unreadMessagesCount} unread
                  </Badge>
                )}
              </div>
              <Link 
                href="/messages" 
                className="text-blue-500 hover:underline text-sm mt-4 inline-block"
              >
                Go to messages
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Properties</h3>
              <Home className="h-6 w-6 text-green-500" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{properties?.data?.length || 0}</p>
              <Link 
                href="/properties" 
                className="text-blue-500 hover:underline text-sm mt-4 inline-block"
              >
                Browse properties
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Visits</h3>
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{pendingVisitsCount + acceptedVisitsCount}</p>
              <div className="flex gap-2 mt-2">
                {pendingVisitsCount > 0 && (
                  <Badge className="bg-yellow-500">
                    {pendingVisitsCount} pending
                  </Badge>
                )}
                {acceptedVisitsCount > 0 && (
                  <Badge className="bg-green-500">
                    {acceptedVisitsCount} scheduled
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Visits */}
        {upcomingVisits.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Upcoming Visits</h3>
            <div className="space-y-4">
              {upcomingVisits.map((visit: UpcomingVisit, index: number) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{visit.propertyTitle}</p>
                    <p className="text-sm text-gray-500">
                      {visit.scheduledDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Link 
                    href={`/properties/${visit.propertyId}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View property
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Keep other components as needed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RecommendedProperties />
          {userType === "seeker" && <SavedSearches />}
          {userType === "realtor" && <ListingStats />}
        </div>
      </main>
    </div>
  );
}
