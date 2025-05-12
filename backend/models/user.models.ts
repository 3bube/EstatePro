import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: "buyer" | "seller" | "agent" | "admin";
  profileImage?: string;
  savedProperties?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  scheduleVisit: mongoose.Types.ObjectId[];
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  role: {
    type: String,
    enum: ["buyer", "seller", "agent", "admin"],
    required: true,
  },
  profileImage: { type: String },
  savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  scheduleVisit: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
