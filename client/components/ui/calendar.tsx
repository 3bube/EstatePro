"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
};

export function Calendar({
  className,
  selected,
  onSelect,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const handleDateSelect = (date: Date) => {
    if (onSelect) {
      onSelect(date);
    }
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i
    );
    const isSelected =
      selected &&
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear();

    days.push(
      <button
        key={i}
        onClick={() => handleDateSelect(date)}
        className={cn(
          "h-9 w-9 rounded-md text-center",
          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        )}
      >
        {i}
      </button>
    );
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="h-7 w-7 bg-transparent p-0"
          onClick={prevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-medium">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <Button
          variant="outline"
          className="h-7 w-7 bg-transparent p-0"
          onClick={nextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-sm">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="h-9 w-9 font-medium">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}
