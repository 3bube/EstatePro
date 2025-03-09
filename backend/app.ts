// app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { createServer } from "http";
import { connectDB } from "./config/database";
import { setupSocketIO } from "./config/socket";
import { errorHandler, notFound } from "./utils/handler";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import propertyRoutes from "./routes/property.routes";
import messageRoutes from "./routes/message.routes";
import appointmentRoutes from "./routes/appointment.routes";
import reviewRoutes from "./routes/review.routes";
import notificationRoutes from "./routes/notification.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import realtorRoutes from "./routes/realtor.routes";
import adminRoutes from "./routes/admin.routes";
import dotenv from "dotenv";
dotenv.config();

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Connect to database
connectDB();

// Setup socket.io
const io = setupSocketIO(httpServer);
app.set("io", io);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/realtor", realtorRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export { app, httpServer };
