"use client";

import { useState, useEffect } from "react";
import { NotificationList } from "@/components/NotificationList";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { NotificationHistory } from "@/components/NotificationHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Notification = {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: "low" | "medium" | "high";
  timestamp: string;
  read: boolean;
  actions?: { label: string; action: string }[];
};

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    // Simulating fetching notifications from an API
    const fetchedNotifications: Notification[] = [
      {
        id: "1",
        title: "New Property Listed",
        message:
          "A new property matching your search criteria has been listed.",
        category: "property",
        priority: "medium",
        timestamp: "2023-06-15T10:30:00Z",
        read: false,
        actions: [{ label: "View Property", action: "view_property" }],
      },
      {
        id: "2",
        title: "Offer Accepted",
        message: "Your offer for 123 Main St has been accepted!",
        category: "offer",
        priority: "high",
        timestamp: "2023-06-14T15:45:00Z",
        read: true,
        actions: [
          { label: "View Offer", action: "view_offer" },
          { label: "Contact Agent", action: "contact_agent" },
        ],
      },
      {
        id: "3",
        title: "Price Reduction",
        message: "The price for 456 Elm St has been reduced by $10,000.",
        category: "price",
        priority: "low",
        timestamp: "2023-06-13T09:15:00Z",
        read: false,
        actions: [{ label: "View Property", action: "view_property" }],
      },
    ];
    setNotifications(fetchedNotifications);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleBulkAction = (action: "markAsRead" | "delete") => {
    if (action === "markAsRead") {
      setNotifications(
        notifications.map((notif) => ({ ...notif, read: true }))
      );
    } else if (action === "delete") {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter(
    (notif) => filter === "all" || notif.category === filter
  );

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sort === "oldest") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (sort === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notification Center</h1>

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Notifications</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleBulkAction("markAsRead")}>
                Mark All as Read
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleBulkAction("delete")}
              >
                Delete All
              </Button>
            </div>
          </div>
          <NotificationList
            notifications={sortedNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="history">
          <NotificationHistory />
        </TabsContent>

        <TabsContent value="preferences">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
