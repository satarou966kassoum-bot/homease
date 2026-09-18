import { Response, NextFunction } from "express";
import { z } from "zod";
import { Payment } from "../models/Payment";
import { Reservation, Notification } from "../models";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";
import { initiateProviderPayment } from "../services/paymentProvider";

// Taux de commission de la plateforme, configurable sans redéploiement de code.
const COMMISSION_RATE = Number(process.env.COMMISSION_RATE || "0.05");

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
    // Garde-fou : impossible de payer tant que le propriétaire n'a pas confirmé
    // la remise du bien (photo preuve envoyée).
    if (reservation.status !== "bien_remis") {
      throw new AppError(
        "Le paiement n'est possible qu'après confirmation de la remise du bien par le propriétaire.",
        400
      );
    }

    const listing = reservation.listing as any;
    const amount = listing.price;
    const platformFeeAmount = Math.round(amount * COMMISSION_RATE);
    const ownerAmount = amount - platformFeeAmount;

    const result = await initiateProviderPayment(data.provider, amount);

    const payment = await Payment.create({
      reservation: reservation._id,
      listing: listing._id,
      payer: req.userId,
      amount,
      platformFeeAmount,
      ownerAmount,
      provider: data.provider,
      providerReference: result.providerReference,
    });

    reservation.status = "payee";
    await reservation.save();

    await Notification.create({
      user: reservation.owner,
      type: "paiement_effectue",
      title: "Paiement reçu",
      body: `Le client a réglé "${listing.title}". Votre part (${ownerAmount} FCFA) vous sera reversée.`,
      link: "/dashboard/reservations",
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
