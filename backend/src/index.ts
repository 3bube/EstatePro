// app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { connectDB } from "../config/database";
import { errorHandler, notFound } from "../utils/handler";
import authRoutes from "../routes/auth.routes";
import userRoutes from "../routes/user.routes";
import propertyRoutes from "../routes/property.routes";
import messageRoutes from "../routes/message.routes";
import appointmentRoutes from "../routes/appointment.routes";
import reviewRoutes from "../routes/review.routes";
import notificationRoutes from "../routes/notification.routes";
import dashboardRoutes from "../routes/dashboard.routes";
import realtorRoutes from "../routes/realtor.routes";
import adminRoutes from "../routes/admin.routes";
import dotenv from "dotenv";
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await connectDB();
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// Connect to database on startup for serverless environment
connectToDatabase();

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Configure CORS to allow specific origins with credentials
const allowedOrigins = [
  "http://localhost:3000",
  "https://estate-pro-steel.vercel.app",
  "https://estatepro.vercel.app",
  "https://estate-pro-client.vercel.app",
];

// Use the cors middleware with proper configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Enable pre-flight for all routes
app.options("*", cors());

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
// Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Single server instance based on environment
const PORT =
  process.env.PORT || (process.env.NODE_ENV !== "production" ? 5003 : 8000);
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup socket.io for local development
if (process.env.NODE_ENV !== "production") {
  try {
    const { setupSocketIO } = require("../config/socket");
    setupSocketIO(server);
  } catch (error) {
    console.error("Socket.io setup error:", error);
  }
}
