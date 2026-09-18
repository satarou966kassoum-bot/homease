import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* ---------------------------- Favorite ---------------------------- */

export interface IFavorite extends Document {
  user: Types.ObjectId;
  listing: Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
FavoriteSchema.index({ user: 1, listing: 1 }, { unique: true });

export const Favorite: Model<IFavorite> =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>("Favorite", FavoriteSchema);

/* --------------------------- Reservation --------------------------- */

// Machine à états du parcours "visite guidée → réservation → remise → paiement" :
// en_attente          : le client a réservé, en attente que le propriétaire propose un rendez-vous
// rdv_propose         : le propriétaire a soumis jour/heure/lieu, en attente de réponse du client
// attente_nouveau_rdv : le client a refusé le créneau (pas l'horaire) et donné ses disponibilités
// rdv_accepte         : le client a accepté le rendez-vous — les deux avertissements sécurité sont envoyés
// bien_remis          : le propriétaire a envoyé la preuve photo — le client peut payer
// payee               : le paiement a été effectué, la plateforme a prélevé sa commission
// annulee             : le client ne veut plus du bien, ou annulation
export type ReservationStatus =
  | "en_attente"
  | "rdv_propose"
  | "attente_nouveau_rdv"
  | "rdv_accepte"
  | "bien_remis"
  | "payee"
  | "annulee";

export type DeclineReason = "ne_veut_plus" | "horaire_inadapte";

export interface IReservation extends Document {
  listing: Types.ObjectId;
  client: Types.ObjectId;
  owner: Types.ObjectId;
  clientFullName: string;
  status: ReservationStatus;

  // Proposition de rendez-vous par le propriétaire
  appointmentDate?: Date;
  appointmentTime?: string;
  appointmentLocation?: string;
  appointmentMapsUrl?: string;

  // Réponse du client en cas de refus pour raison d'horaire
  declineReason?: DeclineReason;
  clientAvailability?: string;

  // Preuve de remise du bien (photo prise par le propriétaire)
  proofPhotoUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clientFullName: { type: String, required: true, trim: true, maxlength: 120 },
    status: {
      type: String,
      enum: [
        "en_attente",
        "rdv_propose",
        "attente_nouveau_rdv",
        "rdv_accepte",
        "bien_remis",
        "payee",
        "annulee",
      ],
      default: "en_attente",
    },
    appointmentDate: { type: Date },
    appointmentTime: { type: String },
    appointmentLocation: { type: String },
    appointmentMapsUrl: { type: String },
    declineReason: { type: String, enum: ["ne_veut_plus", "horaire_inadapte"] },
    clientAvailability: { type: String, maxlength: 500 },
    proofPhotoUrl: { type: String },
  },
  { timestamps: true }
);

export const Reservation: Model<IReservation> =
  mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);


/* -------------------------- Conversation --------------------------- */

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  listing?: Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
    lastMessageAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

/* ----------------------------- Message ------------------------------ */

export type MessageMediaType = "image" | "video" | "audio";

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  mediaUrl?: string;
  mediaType?: MessageMediaType;
  readBy: Types.ObjectId[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, default: "", maxlength: 4000 },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video", "audio"] },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

/* --------------------------- Notification ---------------------------- */

export type NotificationType =
  | "nouvelle_demande_reservation"
  | "reservation_confirmee"
  | "reservation_refusee"
  | "annonce_approuvee"
  | "annonce_rejetee"
  | "nouveau_message"
  | "annonce_expiree"
  | "rdv_propose"
  | "rdv_accepte"
  | "rdv_refuse"
  | "nouvelle_disponibilite"
  | "bien_remis"
  | "paiement_effectue";

export interface INotification extends Document {
  user: Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: [
        "nouvelle_demande_reservation",
        "reservation_confirmee",
        "reservation_refusee",
        "annonce_approuvee",
        "annonce_rejetee",
        "nouveau_message",
        "annonce_expiree",
        "rdv_propose",
        "rdv_accepte",
        "rdv_refuse",
        "nouvelle_disponibilite",
        "bien_remis",
        "paiement_effectue",
      ],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

/* ------------------------------ Report -------------------------------- */

export type ReportReason =
  | "fausse_annonce"
  | "prix_trompeur"
  | "contenu_interdit"
  | "arnaque"
  | "autre";

export type ReportStatus = "ouvert" | "traite" | "rejete";

export interface IReport extends Document {
  reporter: Types.ObjectId;
  listing: Types.ObjectId;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    reason: {
      type: String,
      enum: [
        "fausse_annonce",
        "prix_trompeur",
        "contenu_interdit",
        "arnaque",
        "autre",
      ],
      required: true,
    },
    details: { type: String, maxlength: 2000 },
    status: { type: String, enum: ["ouvert", "traite", "rejete"], default: "ouvert" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
