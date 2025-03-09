import express, { Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { AuthenticatedRequest } from "../utils/handler";
import {
  getSavedProperties,
  getUserActivityData,
  getSavedSearches,
} from "../controllers/dashboard.controller";

const router = express.Router();

// Protected routes (require authentication)
router.use(authenticate);

// User dashboard routes
router.get("/dashboard", (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: "User dashboard data",
    user: req.user,
  });
});

// User saved properties
router.get("/saved-properties", getSavedProperties);

// User activity
router.get("/activity", getUserActivityData);

// User saved searches
router.get("/saved-searches", getSavedSearches);

export default router;
