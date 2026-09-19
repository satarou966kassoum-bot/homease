import { Response, NextFunction } from "express";
import { z } from "zod";
import { Reservation, Notification } from "../models";
import { Listing } from "../models/Listing";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

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

// 1. Le client réserve directement après la visite guidée (plus de date à choisir :
// c'est le propriétaire qui proposera un rendez-vous de remise du bien ensuite).
const createSchema = z.object({
  listingId: z.string(),
  clientFullName: z.string().min(2, "Merci d'indiquer votre nom et prénom."),
});

export async function createReservation(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.userRole !== "client") {
      throw new AppError(
        "Seuls les comptes clients peuvent réserver un bien. Les propriétaires ne peuvent pas réserver.",
        403
      );
    }

    const data = createSchema.parse(req.body);
    const listing = await Listing.findById(data.listingId);
    if (!listing) throw new AppError("Annonce introuvable.", 404);

    const reservation = await Reservation.create({
      listing: listing._id,
      client: req.userId,
      owner: listing.owner,
      clientFullName: data.clientFullName,
      status: "en_attente",
    });

    await Notification.create({
      user: listing.owner,
      type: "nouvelle_demande_reservation",
      title: "Nouvelle réservation",
      body: `${data.clientFullName} a réservé "${listing.title}". Proposez un rendez-vous de remise du bien.`,
      link: "/dashboard/reservations",
    });

    res.status(201).json({
      success: true,
      message:
        "Réservation confirmée. Pour votre sécurité, tout paiement se fait uniquement sur la plateforme, après avoir pris possession du bien. Tout contournement de cette règle peut entraîner des sanctions.",
      data: { reservation },
    });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

// 2. Le propriétaire propose (ou re-propose) un rendez-vous de remise du bien.
const appointmentSchema = z.object({
  appointmentDate: z.string(),
  appointmentTime: z.string().min(1, "L'heure du rendez-vous est requise."),
  appointmentLocation: z.string().min(2, "Le lieu du rendez-vous est requis."),
  appointmentMapsUrl: z.string().url("Le lien Google Maps est obligatoire."),
});

export async function proposeAppointment(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = appointmentSchema.parse(req.body);
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) throw new AppError("Réservation introuvable.", 404);
    if (reservation.owner.toString() !== req.userId) {
      throw new AppError("Action réservée au propriétaire de l'annonce.", 403);
    }
    if (!["en_attente", "attente_nouveau_rdv"].includes(reservation.status)) {
      throw new AppError("Un rendez-vous ne peut plus être proposé à ce stade.", 400);
    }

    reservation.appointmentDate = new Date(data.appointmentDate);
    reservation.appointmentTime = data.appointmentTime;
    reservation.appointmentLocation = data.appointmentLocation;
    reservation.appointmentMapsUrl = data.appointmentMapsUrl;
    reservation.declineReason = undefined;
    reservation.clientAvailability = undefined;
    reservation.status = "rdv_propose";
    await reservation.save();

    await Notification.create({
      user: reservation.client,
      type: "rdv_propose",
      title: "Rendez-vous proposé",
      body: `Le propriétaire propose un rendez-vous le ${data.appointmentDate} à ${data.appointmentTime}.`,
      link: "/reservations",
    });

    res.json({ success: true, message: "Rendez-vous envoyé au client.", data: { reservation } });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

// 3. Le client répond au rendez-vous proposé.
const respondSchema = z.object({
  accept: z.boolean(),
  declineReason: z.enum(["ne_veut_plus", "horaire_inadapte"]).optional(),
  clientAvailability: z.string().max(500).optional(),
});

export async function respondToAppointment(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = respondSchema.parse(req.body);
    const reservation = await Reservation.findById(req.params.id).populate("listing", "title");
    if (!reservation) throw new AppError("Réservation introuvable.", 404);
    if (reservation.client.toString() !== req.userId) {
      throw new AppError("Action réservée au client de cette réservation.", 403);
    }
    if (reservation.status !== "rdv_propose") {
      throw new AppError("Aucun rendez-vous en attente de réponse.", 400);
    }

    const listingTitle = (reservation.listing as any)?.title || "l'annonce";

    if (data.accept) {
      reservation.status = "rdv_accepte";
      await reservation.save();

      // Double avertissement sécurité, à l'acceptation du rendez-vous.
      await Notification.create([
        {
          user: reservation.owner,
          type: "rdv_accepte",
          title: "Rendez-vous accepté",
          body: `Le client a accepté le rendez-vous pour "${listingTitle}". Pour la sécurité de tous, prenez une photo au moment de la remise du bien : elle déclenchera le paiement.`,
          link: "/dashboard/reservations",
        },
        {
          user: reservation.client,
          type: "rdv_accepte",
          title: "Rendez-vous confirmé",
          body: "Pour votre sécurité, ne payez rien tant que vous n'avez pas physiquement le bien en main.",
          link: "/reservations",
        },
      ]);
    } else if (data.declineReason === "ne_veut_plus") {
      reservation.status = "annulee";
      reservation.declineReason = "ne_veut_plus";
      await reservation.save();

      await Notification.create({
        user: reservation.owner,
        type: "rdv_refuse",
        title: "Réservation annulée",
        body: `Le client ne souhaite plus louer/acheter "${listingTitle}".`,
        link: "/dashboard/reservations",
      });
    } else if (data.declineReason === "horaire_inadapte") {
      if (!data.clientAvailability?.trim()) {
        throw new AppError("Merci d'indiquer vos disponibilités.", 422);
      }
      reservation.status = "attente_nouveau_rdv";
      reservation.declineReason = "horaire_inadapte";
      reservation.clientAvailability = data.clientAvailability;
      await reservation.save();

      await Notification.create({
        user: reservation.owner,
        type: "nouvelle_disponibilite",
        title: "Nouveau créneau à proposer",
        body: `L'horaire ne convenait pas au client. Ses disponibilités : ${data.clientAvailability}`,
        link: "/dashboard/reservations",
      });
    } else {
      throw new AppError("Motif de refus manquant.", 422);
    }

    res.json({ success: true, message: "Réponse enregistrée.", data: { reservation } });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

// 4. Le propriétaire envoie la preuve photo de remise du bien (déclenche le paiement).
const proofSchema = z.object({ proofPhotoUrl: z.string().url() });

export async function submitHandoverProof(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = proofSchema.parse(req.body);
    const reservation = await Reservation.findById(req.params.id).populate("listing", "title");
    if (!reservation) throw new AppError("Réservation introuvable.", 404);
    if (reservation.owner.toString() !== req.userId) {
      throw new AppError("Action réservée au propriétaire de l'annonce.", 403);
    }
    if (reservation.status !== "rdv_accepte") {
      throw new AppError("La remise du bien ne peut être confirmée à ce stade.", 400);
    }

    reservation.proofPhotoUrl = data.proofPhotoUrl;
    reservation.status = "bien_remis";
    await reservation.save();

    const listingTitle = (reservation.listing as any)?.title || "l'annonce";
    await Notification.create({
      user: reservation.client,
      type: "bien_remis",
      title: "Le bien vous a été remis",
      body: `Vous pouvez maintenant régler le paiement de "${listingTitle}" en toute sécurité sur la plateforme.`,
      link: "/reservations",
    });

    res.json({ success: true, message: "Preuve envoyée. Le client peut désormais payer.", data: { reservation } });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}
