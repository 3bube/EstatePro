import mongoose from "mongoose";
import { INotification } from "../types/notification.types";

const NotificationSchema = new mongoose.Schema<INotification>({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["message", "appointment", "property_update", "review", "system"],
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  relatedResource: {
    type: {
      type: String,
      enum: ["property", "message", "appointment", "review"],
    },
    id: { type: mongoose.Schema.Types.ObjectId, ref: String },
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);

export default NotificationModel;
