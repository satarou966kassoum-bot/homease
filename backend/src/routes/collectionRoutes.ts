import { Router } from "express";
import {
  getMyCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController";
import { protect, requireRole } from "../middlewares/auth";

const router = Router();

router.use(protect, requireRole("owner", "admin"));
router.get("/mine", getMyCollections);
router.post("/", createCollection);
router.put("/:id", updateCollection);
router.delete("/:id", deleteCollection);

export default router;
