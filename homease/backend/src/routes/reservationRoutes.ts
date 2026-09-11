import { Router } from "express";
import {
  getReservations,
  createReservation,
  updateReservationStatus,
} from "../controllers/reservationController";
import { protect } from "../middlewares/auth";

const router = Router();

router.use(protect);
router.get("/", getReservations);
router.post("/", createReservation);
router.put("/:id", updateReservationStatus);

export default router;
