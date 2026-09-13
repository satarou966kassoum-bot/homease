import { Response, NextFunction } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new AppError("Utilisateur introuvable.", 404);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.userId, data, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new AppError("Utilisateur introuvable.", 404);
    res.json({ success: true, message: "Profil mis à jour.", data: { user } });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

const kycSchema = z.object({
  documentUrl: z.string().url("Le document est requis."),
});

export async function submitKyc(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = kycSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        kycStatus: "en_attente",
        kycDocumentUrl: data.documentUrl,
        kycSubmittedAt: new Date(),
        kycNote: undefined,
      },
      { new: true }
    );
    if (!user) throw new AppError("Utilisateur introuvable.", 404);
    res.json({
      success: true,
      message: "Document envoyé. Votre vérification est en cours d'examen.",
      data: { user },
    });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

// Profil public — visible depuis la messagerie ou une fiche annonce.
// N'expose jamais d'informations sensibles (email, téléphone, statut compte).
export async function getPublicProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id).select(
      "name avatarUrl role kycStatus createdAt"
    );
    if (!user) throw new AppError("Utilisateur introuvable.", 404);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}
