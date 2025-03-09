import express, { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getDashboard,
  getSavedProperties,
  getUserActivityData,
  getRecommendedProperties,
  getSavedSearches,
  getPerformanceMetrics,
  getListingStats
} from "../controllers/dashboard.controller";

const router: Router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

// Dashboard endpoints
router.get("/", getDashboard);
router.get("/saved-properties", getSavedProperties);
router.get("/activity", getUserActivityData);
router.get("/recommended-properties", getRecommendedProperties);
router.get("/saved-searches", getSavedSearches);
router.get("/performance-metrics", getPerformanceMetrics);
router.get("/listing-stats", getListingStats);

export default router;
