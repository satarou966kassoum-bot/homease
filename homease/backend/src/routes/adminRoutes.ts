import { Router } from "express";
import {
  getStats,
  getUsers,
  updateUserStatus,
  getAdminListings,
  updateListingStatus,
  getReports,
  updateReportStatus,
} from "../controllers/adminController";
import { protect, requireRole } from "../middlewares/auth";

const router = Router();

// Toutes les routes admin exigent un JWT valide ET le rôle "admin"
router.use(protect, requireRole("admin"));

router.get("/stats", getStats);

router.get("/users", getUsers);
router.put("/users/:id", updateUserStatus);

router.get("/listings", getAdminListings);
router.put("/listings/:id/status", updateListingStatus);

router.get("/reports", getReports);
router.put("/reports/:id", updateReportStatus);

export default router;
