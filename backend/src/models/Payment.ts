import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type PaymentProvider = "kkiapay" | "fedapay" | "hors_plateforme";
export type PaymentStatus = "en_attente" | "reussi" | "echoue";

export interface IPayment extends Document {
  reservation: Types.ObjectId;
  listing: Types.ObjectId;
  payer: Types.ObjectId;
  amount: number;
  platformFeeAmount: number;
  ownerAmount: number;
  provider: PaymentProvider;
  status: PaymentStatus;
  providerReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    reservation: { type: Schema.Types.ObjectId, ref: "Reservation", required: true },
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    payer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    platformFeeAmount: { type: Number, required: true, min: 0 },
    ownerAmount: { type: Number, required: true, min: 0 },
    provider: {
      type: String,
      enum: ["kkiapay", "fedapay", "hors_plateforme"],
      default: "hors_plateforme",
    },
    status: {
      type: String,
      enum: ["en_attente", "reussi", "echoue"],
      default: "en_attente",
    },
    providerReference: { type: String },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
