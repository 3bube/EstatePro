import express, { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { 
  getPerformanceMetrics, 
  getListingStats 
} from "../controllers/dashboard.controller";

const router: Router = express.Router();

// All realtor routes require authentication
router.use(authenticate);

// Realtor-specific endpoints
router.get("/performance-metrics", getPerformanceMetrics);
router.get("/listing-stats", getListingStats);

export default router;
