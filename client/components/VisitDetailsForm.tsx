"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type VisitDetailsFormProps = {
  selectedDate: Date | undefined;
  selectedTimeSlot: string | undefined;
  propertyId: string;
};

export function VisitDetailsForm({
  selectedDate,
  selectedTimeSlot,
  propertyId,
}: VisitDetailsFormProps) {
  const [visitType, setVisitType] = useState("in-person");
  const [specialRequests, setSpecialRequests] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Submitting form", {
      propertyId,
      selectedDate,
      selectedTimeSlot,
      visitType,
      specialRequests,
      name,
      email,
      phone,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
          Visit Details
        </h2>
        <RadioGroup value={visitType} onValueChange={setVisitType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-person" id="in-person" />
            <Label htmlFor="in-person">In-person visit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video-tour" id="video-tour" />
            <Label htmlFor="video-tour">Video tour</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="special-requests">Special Requests</Label>
        <Textarea
          id="special-requests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requests or questions?"
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
          Contact Information
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E]"
        disabled={!selectedDate || !selectedTimeSlot}
      >
        Schedule Visit
      </Button>
      <p className="text-sm text-gray-500 mt-4">
        Cancellation policy: You can cancel or reschedule your visit up to 24
        hours before the scheduled time without any penalty.
      </p>
    </form>
  );
}
