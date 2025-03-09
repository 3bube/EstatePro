import express, { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  saveProperty,
  getProperty,
  changeProperty,
  removeProperty,
  getAllProperties,
  getPropertiesForUser,
} from "../controllers/property.controller";
import { getRecommendedProperties } from "../controllers/dashboard.controller";

const router: Router = express.Router();

router.post("/create", authenticate, saveProperty);
router.get("/all", getAllProperties);
router.get("/user", authenticate, getPropertiesForUser);
router.get("/recommended", authenticate, getRecommendedProperties);
router.get("/:id", getProperty);
router.put("/:id", authenticate, changeProperty);
router.delete("/:id", authenticate, removeProperty);

export default router;
