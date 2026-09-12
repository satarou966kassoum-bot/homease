import { Router } from "express";
import { getActiveBanners } from "../controllers/bannerController";

const router = Router();

router.get("/", getActiveBanners);

export default router;
