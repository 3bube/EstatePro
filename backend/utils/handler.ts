import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import { logger } from "./logger";
import { IUser } from "../models/user.models";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

type AsyncHandler<T = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync = <T = Request>(fn: AsyncHandler<T>) => {
  return (req: T, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (error as AppError).statusCode || 500;
  const message = error.message || "Something went wrong";

  // Log the error
  logger.error({
    status: statusCode,
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// handle success
export const handleSuccess = (data: any, res: Response) => {
  if (!res.headersSent) {
    res.status(200).json(data);
  }
};

// handle creation
export const handleCreation = (data: any, res: Response) => {
  if (!res.headersSent) {
    res.status(201).json(data);
  }
};

// handle not found
export const handleNotFound = (
  res: Response,
  message: string,
  next: NextFunction
) => {
  if (!res.headersSent) {
    res.status(404).json({ message });
  }
  next();
};
