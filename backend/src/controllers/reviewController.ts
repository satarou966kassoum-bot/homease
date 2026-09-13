import { Response, NextFunction } from "express";
import { z } from "zod";
import { Review } from "../models/Review";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

const createSchema = z.object({
  reviewedUserId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  listingId: z.string().optional(),
});

export async function createReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    if (data.reviewedUserId === req.userId) {
      throw new AppError("Vous ne pouvez pas vous auto-évaluer.", 400);
    }

    const review = await Review.create({
      reviewer: req.userId,
      reviewedUser: data.reviewedUserId,
      rating: data.rating,
      comment: data.comment,
      listing: data.listingId,
    });

    res.status(201).json({ success: true, message: "Avis publié.", data: { review } });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

export async function getUserReviews(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate("reviewer", "name avatarUrl")
      .sort({ createdAt: -1 });

    const average =
      reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0;

    res.json({ success: true, data: { reviews, average, count: reviews.length } });
  } catch (error) {
    next(error);
  }
}
