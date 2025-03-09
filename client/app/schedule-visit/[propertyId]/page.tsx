"use client";

import { useState } from "react";
import { PropertySummary } from "@/components/PropertySummary";
import { VisitCalendar } from "@/components/VisitCalendar";
import { TimeSlotSelection } from "@/components/TimeSlotSelection";
import { VisitDetailsForm } from "@/components/VisitDetailsForm";

export default function ScheduleVisitPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(
    undefined
  );

  // In a real application, you would fetch the property data based on the propertyId
  const property = {
    id: params.propertyId,
    image: "/placeholder.svg?height=200&width=300",
    address: "123 Main St, Anytown, USA",
    price: 500000,
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2C3E50] mb-6">
        Schedule a Visit
      </h1>
      <PropertySummary property={property} />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
            Select a Date
          </h2>
          <VisitCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
            Select a Time
          </h2>
          <TimeSlotSelection
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
          />
        </div>
      </div>
      <VisitDetailsForm
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        propertyId={params.propertyId}
      />
    </div>
  );
}
