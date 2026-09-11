import { Router } from "express";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoriteController";
import { protect } from "../middlewares/auth";

const router = Router();

router.use(protect);
router.get("/", getFavorites);
router.post("/:listingId", addFavorite);
router.delete("/:listingId", removeFavorite);

export default router;
