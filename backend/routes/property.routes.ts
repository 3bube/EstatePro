import express, { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  saveProperty,
  getProperty,
  changeProperty,
  removeProperty,
  getAllProperties,
  getPropertiesForUser,
  schedulePropertyVisit,
  updateVisitStatus,
  getScheduledVisits,
} from "../controllers/property.controller";
import { getRecommendedProperties } from "../controllers/dashboard.controller";

const router: Router = express.Router();

router.post("/create", authenticate, saveProperty);
router.get("/all", getAllProperties);
router.get("/user", authenticate, getPropertiesForUser);
router.get("/recommended", authenticate, getRecommendedProperties);
// This route needs to be BEFORE the /:id route to avoid the ID parameter catching 'visits'
router.get("/visits", authenticate, getScheduledVisits);
router.get("/:id", getProperty);
router.put("/:id", authenticate, changeProperty);
router.delete("/:id", authenticate, removeProperty);
router.post("/:id/visit", authenticate, schedulePropertyVisit);
router.patch("/:id/visit/status", authenticate, updateVisitStatus);
export default router;
