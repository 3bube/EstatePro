import e from "express";
import {
  sendMessage,
  getUserConversation,
  getConversationMessages,
  markMessageAsRead,
} from "../controllers/message.controller";
import { authenticate } from "../middlewares/auth.middleware";
const router = e.Router();

router.post("/send-message", authenticate, sendMessage);
router.get("/", authenticate, getUserConversation);
router.get("/:id", authenticate, getConversationMessages);
router.patch("/:id", authenticate, markMessageAsRead);

export default router;
