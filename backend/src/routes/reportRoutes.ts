import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { Report } from "../models";
import { protect, AuthRequest } from "../middlewares/auth";
import { AppError } from "../middlewares/errorHandler";

const router = Router();

const reportSchema = z.object({
  listingId: z.string(),
  reason: z.enum(["fausse_annonce", "prix_trompeur", "contenu_interdit", "arnaque", "autre"]),
  details: z.string().max(2000).optional(),
});

router.post("/", protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = reportSchema.parse(req.body);
    const report = await Report.create({
      reporter: req.userId,
      listing: data.listingId,
      reason: data.reason,
      details: data.details,
    });
    res.status(201).json({
      success: true,
      message: "Signalement envoyé. Merci de contribuer à la sécurité de Homizzy.",
      data: { report },
    });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
});

export default router;
