export interface IAppointment {
  property: mongoose.Types.ObjectId; // Reference to Property
  requestedBy: mongoose.Types.ObjectId; // Reference to User (buyer)
  host: mongoose.Types.ObjectId; // Reference to User (agent/owner)
  date: Date;
  duration: number; // in minutes
  status: "requested" | "confirmed" | "declined" | "canceled" | "completed";
  type: "in-person" | "video";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  reminderSent: boolean;
}
