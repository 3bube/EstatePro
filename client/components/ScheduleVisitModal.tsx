"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { scheduleVisit } from "@/api/property.api";
import { useToast } from "@/hooks/use-toast";
// Manual date utilities instead of date-fns
import Spinner from "./Spinner";

interface ScheduleVisitModalProps {
  propertyId: string;
  propertyTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
  "15:00", "16:00", "17:00", "18:00"
];

export function ScheduleVisitModal({
  propertyId,
  propertyTitle,
  isOpen,
  onClose,
}: ScheduleVisitModalProps) {
  const { toast } = useToast();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ date?: string; time?: string }>({}); 

  // Reset form when modal is opened/closed
  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setNotes("");
    setErrors({});
  };

  // Schedule visit mutation
  const { mutate, isPending } = useMutation({
    mutationFn: ({ propertyId, scheduledDate, notes }: { propertyId: string; scheduledDate: Date; notes?: string }) => {
      return scheduleVisit(propertyId, scheduledDate, notes);
    },
    onSuccess: () => {
      toast({
        title: "Visit scheduled successfully",
        description: "The property owner will be notified of your request.",
      });
      onClose();
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to schedule visit",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Format date to YYYY-MM-DD format manually
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return timeSlots;
    
    // If selected date is today, only show future time slots
    if (formatDate(selectedDate) === formatDate(today)) {
      const currentHour = today.getHours();
      return timeSlots.filter(slot => {
        const hourOfSlot = parseInt(slot.split(":")[0], 10);
        return hourOfSlot > currentHour;
      });
    }
    
    return timeSlots;
  };
  
  // Custom date filter - don't allow dates in the past or more than 30 days in the future
  const isDateValid = (date: Date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Don't allow dates in the past
    if (date < currentDate) return false;
    
    // Don't allow dates more than 30 days in the future
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (date > maxDate) return false;
    
    return true;
  };
  
  // Format date in a readable format for display
  const formatReadableDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    const newErrors: { date?: string; time?: string } = {};
    
    if (!selectedDate) {
      newErrors.date = "Please select a date";
    }
    
    if (!selectedTime) {
      newErrors.time = "Please select a time";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (!selectedDate || !selectedTime) return;
    
    // Create datetime by combining date and time manually
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);
    
    // Add a default message if notes are empty
    const visitNotes = notes.trim() || 
      `I'd like to schedule a visit on ${formatReadableDate(scheduledDateTime)} at ${selectedTime}. Please confirm if this works for you.`;
    
    // Schedule the visit with notes for the property owner
    mutate({ propertyId, scheduledDate: scheduledDateTime, notes: visitNotes });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a Visit</DialogTitle>
          <DialogDescription>
            {propertyTitle
              ? `Schedule a visit to view ${propertyTitle}`
              : "Choose your preferred date and time for the property visit"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <div className="border rounded-md p-4">
              <div className="calendar-wrapper">
                <Calendar
                  selected={selectedDate}
                  onSelect={(date) => {
                    // Only process when input is a Date object
                    if (date instanceof Date && isDateValid(date)) {
                      setSelectedDate(date);
                    } else if (date === undefined) {
                      setSelectedDate(undefined);
                    }
                  }}
                  className="mx-auto"
                />
              </div>
            </div>
            {selectedDate && <p className="text-sm">{formatReadableDate(selectedDate)}</p>}
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Select Time</Label>
            <Select 
              value={selectedTime} 
              onValueChange={setSelectedTime}
              disabled={!selectedDate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableTimeSlots().map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.time && (
              <p className="text-sm text-red-500">{errors.time}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific questions or requests for the visit?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Spinner /> : null}
            Schedule Visit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
