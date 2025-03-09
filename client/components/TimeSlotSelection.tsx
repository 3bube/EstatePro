type TimeSlotSelectionProps = {
  selectedDate: Date | undefined;
  selectedTimeSlot: string | undefined;
  onSelectTimeSlot: (timeSlot: string) => void;
};

export function TimeSlotSelection({
  selectedDate,
  selectedTimeSlot,
  onSelectTimeSlot,
}: TimeSlotSelectionProps) {
  const timeSlots = [
    { segment: "Morning", slots: ["09:00", "10:00", "11:00"] },
    { segment: "Afternoon", slots: ["13:00", "14:00", "15:00", "16:00"] },
    { segment: "Evening", slots: ["17:00", "18:00", "19:00"] },
  ];

  if (!selectedDate) {
    return <p className="text-gray-500">Please select a date first</p>;
  }

  return (
    <div className="space-y-4">
      {timeSlots.map((segment) => (
        <div key={segment.segment}>
          <h3 className="font-medium text-[#2C3E50] mb-2">{segment.segment}</h3>
          <div className="grid grid-cols-3 gap-2">
            {segment.slots.map((slot) => (
              <button
                key={slot}
                onClick={() => onSelectTimeSlot(slot)}
                className={`py-2 px-4 rounded-md text-sm ${
                  selectedTimeSlot === slot
                    ? "bg-[#2C3E50] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
