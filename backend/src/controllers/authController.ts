import { Response, NextFunction } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Adresse email invalide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  phone: z.string().optional(),
  role: z.enum(["client", "owner"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

function sanitizeUser(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

export async function register(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new AppError("Un compte existe déjà avec cet email.", 409);
    }

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      phone: data.phone,
      role: data.role || "client",
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès.",
      data: { user: sanitizeUser(user), token },
    });
  } catch (error: any) {
    if (error?.issues) {
      return next(new AppError(error.issues[0].message, 422));
    }
    next(error);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      throw new AppError("Email ou mot de passe incorrect.", 401);
    }
    if (user.isSuspended) {
      throw new AppError("Ce compte a été suspendu. Contactez le support.", 403);
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new AppError("Email ou mot de passe incorrect.", 401);
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: "Connexion réussie.",
      data: { user: sanitizeUser(user), token },
    });
  } catch (error: any) {
    if (error?.issues) {
      return next(new AppError(error.issues[0].message, 422));
    }
    next(error);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new AppError("Utilisateur introuvable.", 404);
    res.json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
}
