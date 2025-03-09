import mongoose from "mongoose";
import { IReview } from "../types/review.types";

const ReviewSchema = new mongoose.Schema<IReview>({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
  responses: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String },
      createdAt: { type: Date },
    },
  ],
});

const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);

export default ReviewModel;
