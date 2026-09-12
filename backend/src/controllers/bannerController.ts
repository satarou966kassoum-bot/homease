import { Response, NextFunction } from "express";
import { z } from "zod";
import { HeroBanner } from "../models/HeroBanner";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

const bannerSchema = z.object({
  imageUrl: z.string().url(),
  title: z.string().max(120).optional(),
  subtitle: z.string().max(200).optional(),
  linkUrl: z.string().optional(),
  order: z.number().optional(),
});

// Public — utilisé sur la homepage
export async function getActiveBanners(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const banners = await HeroBanner.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: { banners } });
  } catch (error) {
    next(error);
  }
}

// Admin — toutes les bannières, actives ou non
export async function getAllBanners(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const banners = await HeroBanner.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: { banners } });
  } catch (error) {
    next(error);
  }
}

export async function createBanner(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = bannerSchema.parse(req.body);
    const count = await HeroBanner.countDocuments();
    const banner = await HeroBanner.create({ ...data, order: data.order ?? count });
    res.status(201).json({ success: true, message: "Bannière ajoutée.", data: { banner } });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

export async function updateBanner(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const banner = await HeroBanner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) throw new AppError("Bannière introuvable.", 404);
    res.json({ success: true, message: "Bannière mise à jour.", data: { banner } });
  } catch (error) {
    next(error);
  }
}

export async function deleteBanner(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const banner = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!banner) throw new AppError("Bannière introuvable.", 404);
    res.json({ success: true, message: "Bannière supprimée." });
  } catch (error) {
    next(error);
  }
}
