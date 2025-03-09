"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState({
    priceChanges: true,
    newMessages: true,
    appointmentReminders: true,
    newProperties: true,
    reviewResponses: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // Here you would typically send the updated preferences to your backend
    console.log("Saving preferences:", preferences);
    // Show a success message or redirect
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose which notifications you&apos;d like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="price-changes"
              className="text-sm font-medium text-gray-700"
            >
              Price changes
            </label>
            <Switch
              id="price-changes"
              checked={preferences.priceChanges}
              onCheckedChange={() => handleToggle("priceChanges")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="new-messages"
              className="text-sm font-medium text-gray-700"
            >
              New messages
            </label>
            <Switch
              id="new-messages"
              checked={preferences.newMessages}
              onCheckedChange={() => handleToggle("newMessages")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="appointment-reminders"
              className="text-sm font-medium text-gray-700"
            >
              Appointment reminders
            </label>
            <Switch
              id="appointment-reminders"
              checked={preferences.appointmentReminders}
              onCheckedChange={() => handleToggle("appointmentReminders")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="new-properties"
              className="text-sm font-medium text-gray-700"
            >
              New properties matching your search
            </label>
            <Switch
              id="new-properties"
              checked={preferences.newProperties}
              onCheckedChange={() => handleToggle("newProperties")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="review-responses"
              className="text-sm font-medium text-gray-700"
            >
              Review responses
            </label>
            <Switch
              id="review-responses"
              checked={preferences.reviewResponses}
              onCheckedChange={() => handleToggle("reviewResponses")}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSave}
            className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E]"
          >
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
