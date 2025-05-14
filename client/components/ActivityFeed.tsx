"use client";

import { useState, useEffect } from "react";
import { getUserActivity } from "@/api/dashboard.api";
import { fetchConversations } from "@/api/message.api";
import { getPropertyByUserId } from "@/api/property.api";
import { useAuth } from "@/context/AuthContext";

type Conversation = {
  _id?: string;
  title?: string;
  propertyTitle?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type PropertyAddress = {
  street?: string;
  city?: string;
};

type Property = {
  _id?: string;
  title?: string;
  address?: PropertyAddress;
  createdAt?: string | Date;
  scheduledVisits?: Array<Visit>;
  status?: string;
};

type Visit = {
  _id?: string;
  status: string;
  propertyTitle?: string;
  propertyId?: string;
  createdAt?: string | Date;
};

type Activity = {
  id: string | number;
  action: string;
  property: string;
  time: string;
  timestamp?: Date;
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2628000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  
  return new Date(date).toLocaleDateString();
};

export function ActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // Try the dedicated activity API first
        const activityData = await getUserActivity().catch(() => null);
        
        if (activityData?.activities && activityData.activities.length > 0) {
          // Use dedicated activity API if it returns data
          setActivities(activityData.activities);
        } else {
          // Otherwise, build activity data from multiple sources
          const activityItems: Activity[] = [];
          
          // 1. Get messages/conversations for communication activity
          try {
            const conversationsResponse = await fetchConversations().catch(() => ({ conversations: [] }));
            if (conversationsResponse?.conversations?.length) {
              conversationsResponse.conversations.slice(0, 5).forEach((conversation: Conversation, index: number) => {
                const timestamp = new Date(conversation.updatedAt || conversation.createdAt || new Date());
                activityItems.push({
                  id: `msg-${index}`,
                  action: "Sent a message",
                  property: conversation.propertyTitle || conversation.title || "Property inquiry",
                  time: formatTimeAgo(timestamp),
                  timestamp: timestamp
                });
              });
            }
          } catch (e) {
            console.error("Error fetching conversations:", e);
          }
          
          // 2. Get property data for visit/property activity
          if (user?.role === "agent" || user?.role === "realtor") {
            try {
              const propertiesResponse = await getPropertyByUserId().catch(() => ({ data: [] }));
              if (propertiesResponse?.data?.length) {
                // Add recent property listings
                propertiesResponse.data.slice(0, 3).forEach((property: Property, index: number) => {
                  const timestamp = new Date(property.createdAt || new Date());
                  if ((new Date().getTime() - timestamp.getTime()) < 30 * 24 * 60 * 60 * 1000) { // Within last 30 days
                    activityItems.push({
                      id: `prop-${property._id || index}`,
                      action: "Listed a property",
                      property: property.title || `${property.address?.street || ""}, ${property.address?.city || ""}`,
                      time: formatTimeAgo(timestamp),
                      timestamp: timestamp
                    });
                  }
                });
                
                // Add visit request activity
                const visits = propertiesResponse.data
                  .flatMap((property: Property) => {
                    if (!property.scheduledVisits?.length) return [];
                    
                    return property.scheduledVisits.map((visit: Visit) => ({
                      ...visit,
                      propertyTitle: property.title,
                      propertyId: property._id
                    }));
                  })
                  .filter((visit: Visit & { propertyTitle?: string; propertyId?: string }) => !!visit);
                  
                visits.slice(0, 5).forEach((visit: Visit & { propertyTitle?: string; propertyId?: string }, index: number) => {
                  const timestamp = new Date(visit.createdAt || new Date());
                  activityItems.push({
                    id: `visit-${index}`,
                    action: visit.status === "pending" 
                      ? "Received visit request" 
                      : `${visit.status === "accepted" ? "Accepted" : "Declined"} visit request`,
                    property: visit.propertyTitle || "Property visit",
                    time: formatTimeAgo(timestamp),
                    timestamp: timestamp
                  });
                });
              }
            } catch (e) {
              console.error("Error fetching property data:", e);
            }
          }
          
          // If we have activity items, sort and set them
          if (activityItems.length > 0) {
            // Sort by timestamp, newest first
            setActivities(
              activityItems
                .sort((a, b) => {
                  const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                  const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                  return dateB - dateA;
                })
                .slice(0, 10) // Limit to 10 items
            );
          } else {
            // Fallback data
            setActivities([
              {
                id: 1,
                action: "Saved a property",
                property: "123 Main St",
                time: "2 hours ago",
              },
              {
                id: 2,
                action: "Scheduled a visit",
                property: "456 Elm St",
                time: "1 day ago",
              },
              {
                id: 3,
                action: "Sent a message",
                property: "789 Oak St",
                time: "3 days ago",
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        // Use fallback data on error
        setActivities([
          {
            id: 1,
            action: "Saved a property",
            property: "123 Main St",
            time: "2 hours ago",
          },
          {
            id: 2,
            action: "Scheduled a visit",
            property: "456 Elm St",
            time: "1 day ago",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
        Recent Activity
      </h2>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex justify-between items-center border-b pb-2">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.property}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
}
