import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import UserModel, { IUser } from "../models/user.models";
import { AppError } from "../utils/AppError";
import mongoose, { Document } from "mongoose";

// Export individual functions instead of a class
export const registerUser = async (userData: any) => {
  // Check if user already exists
  const existingUser = await UserModel.findOne({
    email: userData.email,
  }).exec();
  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Create new user
  const newUser = new UserModel({
    ...userData,
    password: hashedPassword,
  });

  await newUser.save();
  return sanitizeUser(newUser);
};

export const loginUser = async (email: string, password: string) => {
  const user = (await UserModel.findOne({ email }).exec()) as IUser & Document;

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateAccessToken(user._id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const forgotPassword = async (email: string) => {
  const user = (await UserModel.findOne({ email }).exec()) as IUser & Document;

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  return resetToken;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = (await UserModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).exec()) as IUser & Document;

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: "Password has been reset successfully" };
};

interface TokenPayload {
  userId: string;
}

// Helper functions
const generateAccessToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  const payload: TokenPayload = {
    userId: userId.toString(),
  };

  try {
    return jwt.sign(payload, secret, {
      expiresIn: 3600, // 1 hour in seconds
    });
  } catch (error) {
    throw new AppError("Error generating token", 500);
  }
};

const sanitizeUser = (user: IUser) => {
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};
