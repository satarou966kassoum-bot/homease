import { Response, NextFunction } from "express";
import { z } from "zod";
import { Collection } from "../models/Collection";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

export async function getMyCollections(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const collections = await Collection.find({ owner: req.userId })
      .populate("listings", "title price photos city neighborhood status")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { collections } });
  } catch (error) {
    next(error);
  }
}

const createSchema = z.object({ name: z.string().min(2).max(80) });

export async function createCollection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const collection = await Collection.create({ owner: req.userId, name: data.name, listings: [] });
    res.status(201).json({ success: true, message: "Collection créée.", data: { collection } });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

export async function updateCollection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const collection = await Collection.findOne({ _id: req.params.id, owner: req.userId });
    if (!collection) throw new AppError("Collection introuvable.", 404);

    if (typeof req.body.name === "string") collection.name = req.body.name;
    if (Array.isArray(req.body.listings)) collection.listings = req.body.listings;
    await collection.save();

    res.json({ success: true, message: "Collection mise à jour.", data: { collection } });
  } catch (error) {
    next(error);
  }
}

export async function deleteCollection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const collection = await Collection.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!collection) throw new AppError("Collection introuvable.", 404);
    res.json({ success: true, message: "Collection supprimée." });
  } catch (error) {
    next(error);
  }
}
