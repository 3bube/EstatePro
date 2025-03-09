import { Request, Response } from "express";
import { catchAsync, AuthenticatedRequest } from "../utils/handler";
import { AppError } from "../utils/AppError";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../services/auth.services";
import { IUser } from "../types/user.types";

// Register user
export const register = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const newUser = await registerUser(userData);
  res.status(201).json({
    success: true,
    data: newUser,
  });
});

// Login user
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, token } = await loginUser(email, password);

  res.status(200).json({
    success: true,
    token,
    data: user,
  });
});

// Forgot password
export const forgotPasswordHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await forgotPassword(email);

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  }
);

// Reset password
export const resetPasswordHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    await resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  }
);

// Get current user
export const getCurrentUser = catchAsync<AuthenticatedRequest>(
  async (req, res: Response) => {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
);

// Logout user
export const logout = catchAsync(async (req: Request, res: Response) => {
  // Clear any session data if needed
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
