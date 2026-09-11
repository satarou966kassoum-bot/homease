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

export type ReservationStatus =
  | "en_attente"
  | "confirmee"
  | "refusee"
  | "annulee"
  | "terminee";

export interface IReservation extends Document {
  listing: Types.ObjectId;
  client: Types.ObjectId;
  owner: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  message?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    message: { type: String, maxlength: 1000 },
    status: {
      type: String,
      enum: ["en_attente", "confirmee", "refusee", "annulee", "terminee"],
      default: "en_attente",
    },
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

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
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
    content: { type: String, required: true, maxlength: 4000 },
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
  | "annonce_expiree";

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
