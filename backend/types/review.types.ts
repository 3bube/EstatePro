export interface IReview {
  property: mongoose.Types.ObjectId; // Reference to Property
  reviewer: mongoose.Types.ObjectId; // Reference to User
  rating: number; // 1-5
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean; // For moderation if needed
  helpfulCount: number;
  responses: {
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
}
