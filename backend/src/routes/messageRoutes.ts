import { Router } from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} from "../controllers/messageController";
import { protect } from "../middlewares/auth";

const router = Router();

router.use(protect);
router.get("/", getConversations);
router.post("/", startConversation);
router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);

export default router;
