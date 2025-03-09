import { Document, Types } from "mongoose";
import { IProperty } from "./property.types";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: "buyer" | "seller" | "agent" | "admin";
  profileImage?: string;
  savedProperties: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
