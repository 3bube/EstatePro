"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type NotificationPreference = {
  id: string;
  name: string;
  enabled: boolean;
};

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    { id: "new_property", name: "New Property Listings", enabled: true },
    { id: "price_changes", name: "Price Changes", enabled: true },
    { id: "offers", name: "Offer Updates", enabled: true },
    { id: "messages", name: "New Messages", enabled: true },
    { id: "appointments", name: "Appointment Reminders", enabled: true },
  ]);

  const handleToggle = (id: string) => {
    setPreferences(
      preferences.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleSave = () => {
    // Here you would typically send the updated preferences to your backend
    console.log("Saving preferences:", preferences);
    // Show a success message or redirect
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notification Preferences</h2>
      {preferences.map((preference) => (
        <div key={preference.id} className="flex items-center justify-between">
          <Label htmlFor={preference.id} className="flex flex-col">
            <span className="font-medium">{preference.name}</span>
            <span className="text-sm text-gray-500">
              Receive notifications about {preference.name.toLowerCase()}
            </span>
          </Label>
          <Switch
            id={preference.id}
            checked={preference.enabled}
            onCheckedChange={() => handleToggle(preference.id)}
          />
        </div>
      ))}
      <Button onClick={handleSave} className="mt-6">
        Save Preferences
      </Button>
    </div>
  );
}
