import { Router } from "express";
import { initiatePayment, getMyPayments, updatePaymentStatus } from "../controllers/paymentController";
import { protect, requireRole } from "../middlewares/auth";

const router = Router();

router.use(protect);
router.get("/mine", getMyPayments);
router.post("/", initiatePayment);
router.put("/:id", requireRole("admin"), updatePaymentStatus);

export default router;
