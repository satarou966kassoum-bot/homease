import { Router } from "express";
import { getMe, updateMe, submitKyc, getPublicProfile } from "../controllers/userController";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/kyc", protect, submitKyc);
router.get("/:id/public", getPublicProfile);

export default router;
