import { Router } from "express";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getMyStats,
} from "../controllers/listingController";
import { protect, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/", getListings);
router.get("/mine/all", protect, requireRole("owner", "admin"), getMyListings);
router.get("/mine/stats", protect, requireRole("owner", "admin"), getMyStats);
router.get("/:id", getListingById);
router.post("/", protect, requireRole("owner", "admin"), createListing);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);

export default router;
