import mongoose from "mongoose";
import { IAppointment } from "../types/appointment.types";

const AppointmentSchema = new mongoose.Schema<IAppointment>({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AppointmentModel = mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default AppointmentModel;
