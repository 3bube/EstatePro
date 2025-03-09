"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type HistoricalNotification = {
  id: string;
  title: string;
  category: string;
  timestamp: string;
};

export function NotificationHistory() {
  const [history, setHistory] = useState<HistoricalNotification[]>([
    {
      id: "1",
      title: "New Property Listed",
      category: "property",
      timestamp: "2023-06-10T10:30:00Z",
    },
    {
      id: "2",
      title: "Offer Accepted",
      category: "offer",
      timestamp: "2023-06-09T15:45:00Z",
    },
    {
      id: "3",
      title: "Price Reduction",
      category: "price",
      timestamp: "2023-06-08T09:15:00Z",
    },
    {
      id: "4",
      title: "New Message Received",
      category: "message",
      timestamp: "2023-06-07T14:20:00Z",
    },
    {
      id: "5",
      title: "Appointment Reminder",
      category: "appointment",
      timestamp: "2023-06-06T11:00:00Z",
    },
  ]);

  const handleClearHistory = () => {
    // Here you would typically send a request to your backend to clear the history
    setHistory([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notification History</h2>
        <Button variant="destructive" onClick={handleClearHistory}>
          Clear History
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell>{notification.title}</TableCell>
              <TableCell>{notification.category}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(notification.timestamp), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {history.length === 0 && (
        <p className="text-center text-gray-500 my-4">
          No notification history to display.
        </p>
      )}
    </div>
  );
}
