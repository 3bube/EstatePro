"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/api/message.api";
import { scheduleVisit } from "@/api/property.api";
import { useAuth } from "@/context/AuthContext";

type PropertySidebarProps = {
  property: {
    _id: string;
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
  };
};

export function PropertySidebar({ property }: PropertySidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      sendMessage({
        recipientId: user?._id || "", // You should provide this based on context
        propertyId: property._id.toString(),
        content,
        type: "visit",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const scheduleVisitMutation = useMutation({
    mutationFn: (date: Date) => scheduleVisit(property._id.toString(), date),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);

    // Format the date for the message
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Send message about the visit
    const message = `I'd like to schedule a visit on ${formatted}`;
    sendMessageMutation.mutate(message);

    // Schedule the visit in the backend
    scheduleVisitMutation.mutate(date);

    setOpen(false);
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
          Property Details
        </h2>
        <Image
          src={property?.images[0] ?? "/placeholder.svg"}
          alt={property?.title || ""}
          width={300}
          height={200}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-medium text-[#2C3E50] mb-2">
          {property?.title}
        </h3>
        <p className="text-[#E74C3C] font-bold mb-2">
          ${property?.price.toLocaleString()}
        </p>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>{property?.bedrooms} beds</span>
          <span>{property?.bathrooms} baths</span>
          <span>{property?.area?.toLocaleString()} sqft</span>
        </div>
        {/* <div className="space-y-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="w-full bg-[#2C3E50] text-white py-2 px-4 rounded hover:bg-[#34495E]">
                Schedule Visit
              </button>
            </DialogTrigger>
            <DialogContent className="w-fit">
              <DialogHeader>
                <DialogTitle>Select a Date</DialogTitle>
              </DialogHeader>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
              />
            </DialogContent>
          </Dialog>

          <button className="w-full bg-white text-[#2C3E50] border border-[#2C3E50] py-2 px-4 rounded hover:bg-gray-50">
            Make Offer
          </button>
        </div> */}
      </div>
    </aside>
  );
}
