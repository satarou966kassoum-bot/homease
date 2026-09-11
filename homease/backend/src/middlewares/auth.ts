import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../models/User";
import { AppError } from "./errorHandler";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

export async function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Non autorisé. Veuillez vous connecter.", 401);
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError("Utilisateur introuvable.", 401);
    }
    if (user.isSuspended) {
      throw new AppError("Ce compte a été suspendu.", 403);
    }

    req.userId = user._id.toString();
    req.userRole = user.role;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError("Session invalide ou expirée. Reconnectez-vous.", 401));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return next(
        new AppError("Vous n'avez pas la permission d'effectuer cette action.", 403)
      );
    }
    next();
  };
}
