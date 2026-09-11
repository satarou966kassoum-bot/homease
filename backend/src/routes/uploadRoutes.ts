import { Router } from "express";
import { getUploadSignature } from "../controllers/uploadController";
import { protect, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/signature", protect, requireRole("owner", "admin"), getUploadSignature);

export default router;
