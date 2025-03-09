export interface INotification {
  recipient: mongoose.Types.ObjectId; // Reference to User
  type: "message" | "appointment" | "property_update" | "review" | "system";
  title: string;
  content: string;
  relatedResource?: {
    type: "property" | "message" | "appointment" | "review";
    id: mongoose.Types.ObjectId;
  };
  read: boolean;
  createdAt: Date;
}
