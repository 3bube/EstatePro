import { Calendar } from "@/components/ui/calendar";

type VisitCalendarProps = {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
};

export function VisitCalendar({
  selectedDate,
  onSelectDate,
}: VisitCalendarProps) {
  // In a real application, you would fetch the booked dates from your backend
  const bookedDates = [
    new Date(2023, 5, 15),
    new Date(2023, 5, 16),
    new Date(2023, 5, 17),
  ];

  const isDateUnavailable = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.getDate() === date.getDate() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      className="rounded-md border"
      disabled={
        (date) =>
          date < new Date() || // Disable past dates
          date > new Date(new Date().setMonth(new Date().getMonth() + 2)) || // Disable dates more than 2 months in the future
          isDateUnavailable(date) // Disable booked dates
      }
    />
  );
}
