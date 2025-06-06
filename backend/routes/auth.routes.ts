import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", logout);

export default router;
