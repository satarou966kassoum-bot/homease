import { Response, NextFunction } from "express";
import { z } from "zod";
import { Payment } from "../models/Payment";
import { Reservation } from "../models";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";
import { initiateProviderPayment } from "../services/paymentProvider";

const initiateSchema = z.object({
  reservationId: z.string(),
  provider: z.enum(["kkiapay", "fedapay", "hors_plateforme"]).default("hors_plateforme"),
});

export async function initiatePayment(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = initiateSchema.parse(req.body);
    const reservation = await Reservation.findById(data.reservationId).populate("listing");
    if (!reservation) throw new AppError("Réservation introuvable.", 404);
    if (reservation.client.toString() !== req.userId) {
      throw new AppError("Cette réservation ne vous appartient pas.", 403);
    }

    const listing = reservation.listing as any;
    const result = await initiateProviderPayment(data.provider, listing.price);

    const payment = await Payment.create({
      reservation: reservation._id,
      listing: listing._id,
      payer: req.userId,
      amount: listing.price,
      provider: data.provider,
      providerReference: result.providerReference,
    });

    res.status(201).json({
      success: true,
      message: result.instructions,
      data: { payment },
    });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

export async function getMyPayments(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const payments = await Payment.find({ payer: req.userId })
      .populate("listing", "title price")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { payments } });
  } catch (error) {
    next(error);
  }
}

export async function updatePaymentStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = req.body as { status: "reussi" | "echoue" };
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!payment) throw new AppError("Paiement introuvable.", 404);
    res.json({ success: true, message: "Statut du paiement mis à jour.", data: { payment } });
  } catch (error) {
    next(error);
  }
}
