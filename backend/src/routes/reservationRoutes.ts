import { Router } from "express";
import {
  getReservations,
  createReservation,
  proposeAppointment,
  respondToAppointment,
  submitHandoverProof,
} from "../controllers/reservationController";
import { protect } from "../middlewares/auth";

const router = Router();

router.use(protect);
router.get("/", getReservations);
router.post("/", createReservation);
router.put("/:id/appointment", proposeAppointment);
router.put("/:id/respond", respondToAppointment);
router.put("/:id/proof", submitHandoverProof);

export default router;
