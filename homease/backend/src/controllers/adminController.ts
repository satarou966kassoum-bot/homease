import { Response, NextFunction } from "express";
import { User } from "../models/User";
import { Listing } from "../models/Listing";
import { Reservation, Report, Notification } from "../models";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [
      totalUsers,
      totalListings,
      activeListings,
      pendingListings,
      totalReservations,
      recentUsers,
      openReports,
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ status: "approuvee" }),
      Listing.countDocuments({ status: "en_attente" }),
      Reservation.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
      Report.countDocuments({ status: "ouvert" }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalListings,
        activeListings,
        pendingListings,
        totalReservations,
        openReports,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { q, role, page = "1", limit = "20" } = req.query as Record<string, string>;
    const filter: Record<string, any> = {};
    if (q) filter.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }];
    if (role) filter.role = role;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: { users, pagination: { page: pageNum, total, totalPages: Math.ceil(total / limitNum) } },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { isSuspended, role } = req.body as { isSuspended?: boolean; role?: string };
    const update: Record<string, any> = {};
    if (isSuspended !== undefined) update.isSuspended = isSuspended;
    if (role) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) throw new AppError("Utilisateur introuvable.", 404);

    res.json({ success: true, message: "Utilisateur mis à jour.", data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function getAdminListings(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Listing.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        listings,
        pagination: { page: pageNum, total, totalPages: Math.ceil(total / limitNum) },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateListingStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = req.body as { status: string };
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!listing) throw new AppError("Annonce introuvable.", 404);

    if (status === "approuvee" || status === "rejetee") {
      await Notification.create({
        user: listing.owner,
        type: status === "approuvee" ? "annonce_approuvee" : "annonce_rejetee",
        title: status === "approuvee" ? "Annonce approuvée" : "Annonce rejetée",
        body: `Votre annonce "${listing.title}" a été ${
          status === "approuvee" ? "approuvée" : "rejetée"
        }.`,
        link: "/dashboard/listings",
      });
    }

    res.json({ success: true, message: "Statut de l'annonce mis à jour.", data: { listing } });
  } catch (error) {
    next(error);
  }
}

export async function getReports(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email")
      .populate("listing", "title")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { reports } });
  } catch (error) {
    next(error);
  }
}

export async function updateReportStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = req.body as { status: string };
    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!report) throw new AppError("Signalement introuvable.", 404);
    res.json({ success: true, message: "Signalement mis à jour.", data: { report } });
  } catch (error) {
    next(error);
  }
}
