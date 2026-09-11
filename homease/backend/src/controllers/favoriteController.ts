import { Response, NextFunction } from "express";
import { Favorite } from "../models";
import { AuthRequest } from "../middlewares/auth";

export async function getFavorites(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const favorites = await Favorite.find({ user: req.userId }).populate("listing");
    res.json({ success: true, data: { favorites } });
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const favorite = await Favorite.findOneAndUpdate(
      { user: req.userId, listing: req.params.listingId },
      { user: req.userId, listing: req.params.listingId },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, message: "Ajouté aux favoris.", data: { favorite } });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await Favorite.findOneAndDelete({ user: req.userId, listing: req.params.listingId });
    res.json({ success: true, message: "Retiré des favoris." });
  } catch (error) {
    next(error);
  }
}
