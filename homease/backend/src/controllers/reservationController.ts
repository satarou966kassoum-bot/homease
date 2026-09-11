import { Response, NextFunction } from "express";
import { z } from "zod";
import { Reservation, Notification } from "../models";
import { Listing } from "../models/Listing";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

const createSchema = z.object({
  listingId: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export async function getReservations(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const reservations = await Reservation.find({
      $or: [{ client: req.userId }, { owner: req.userId }],
    })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { reservations } });
  } catch (error) {
    next(error);
  }
}

export async function createReservation(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createSchema.parse(req.body);
    const listing = await Listing.findById(data.listingId);
    if (!listing) throw new AppError("Annonce introuvable.", 404);

    const reservation = await Reservation.create({
      listing: listing._id,
      client: req.userId,
      owner: listing.owner,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      message: data.message,
    });

    await Notification.create({
      user: listing.owner,
      type: "nouvelle_demande_reservation",
      title: "Nouvelle demande de réservation",
      body: `Une demande de réservation a été faite pour "${listing.title}".`,
      link: `/dashboard/reservations`,
    });

    res.status(201).json({
      success: true,
      message: "Demande de réservation envoyée.",
      data: { reservation },
    });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

export async function updateReservationStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = req.body as { status: string };
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) throw new AppError("Réservation introuvable.", 404);

    const isOwner = reservation.owner.toString() === req.userId;
    if (!isOwner && req.userRole !== "admin") {
      throw new AppError("Action non autorisée.", 403);
    }

    reservation.status = status as any;
    await reservation.save();

    if (status === "confirmee" || status === "refusee") {
      await Notification.create({
        user: reservation.client,
        type: status === "confirmee" ? "reservation_confirmee" : "reservation_refusee",
        title:
          status === "confirmee" ? "Réservation confirmée" : "Réservation refusée",
        body:
          status === "confirmee"
            ? "Votre demande de réservation a été confirmée."
            : "Votre demande de réservation a été refusée.",
        link: "/reservations",
      });
    }

    res.json({ success: true, message: "Statut mis à jour.", data: { reservation } });
  } catch (error) {
    next(error);
  }
}
