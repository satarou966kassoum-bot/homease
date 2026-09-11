import crypto from "crypto";
import { Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

// Génère une signature Cloudinary côté serveur (le secret API ne quitte jamais
// le backend) afin que le frontend puisse envoyer directement le fichier
// (image ou vidéo) à Cloudinary, sans jamais faire transiter le fichier par
// le serveur Render (dont le disque n'est pas persistant sur le plan gratuit).
export function getUploadSignature(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { cloudName, apiKey, apiSecret } = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    };

    if (!cloudName || !apiKey || !apiSecret) {
      throw new AppError(
        "L'envoi de fichiers n'est pas encore configuré (variables Cloudinary manquantes).",
        503
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "homease/listings";
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    res.json({
      success: true,
      data: { timestamp, folder, signature, apiKey, cloudName },
    });
  } catch (error) {
    next(error);
  }
}
