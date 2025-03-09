"use client";

import { useState, useEffect } from "react";
import { getUserActivity } from "@/api/dashboard.api";

type Activity = {
  id: number;
  action: string;
  property: string;
  time: string;
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getUserActivity();
        
        // If API returns activities, use them; otherwise, use fallback data
        if (data?.activities && data.activities.length > 0) {
          setActivities(data.activities);
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
  }, []);

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
      ) : (
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
      )}
    </div>
  );
}
