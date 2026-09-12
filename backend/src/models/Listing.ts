import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ListingCategory =
  | "chambre"
  | "maison"
  | "appartement"
  | "villa"
  | "parcelle"
  | "bureau"
  | "meuble";

export type TransactionType = "location" | "vente" | "reservation";

export type ListingStatus =
  | "brouillon"
  | "en_attente"
  | "approuvee"
  | "rejetee"
  | "suspendue"
  | "vendue_louee";

export interface IListing extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  category: ListingCategory;
  transactionType: TransactionType;
  price: number;
  city: string;
  neighborhood: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  surfaceM2?: number;
  furnished: boolean;
  amenities: string[];
  photos: string[];
  videos: string[];
  mapsUrl?: string;
  boostRequested: boolean;
  status: ListingStatus;
  isDemo: boolean;
  isFeatured: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 4000 },
    category: {
      type: String,
      enum: [
        "chambre",
        "maison",
        "appartement",
        "villa",
        "parcelle",
        "bureau",
        "meuble",
      ],
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["location", "vente", "reservation"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    city: { type: String, required: true, trim: true, index: true },
    neighborhood: { type: String, required: true, trim: true, index: true },
    address: { type: String, trim: true },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    surfaceM2: { type: Number, min: 0 },
    furnished: { type: Boolean, default: false },
    amenities: { type: [String], default: [] },
    photos: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    mapsUrl: { type: String },
    boostRequested: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        "brouillon",
        "en_attente",
        "approuvee",
        "rejetee",
        "suspendue",
        "vendue_louee",
      ],
      default: "en_attente",
    },
    isDemo: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ListingSchema.index({ title: "text", description: "text" });
ListingSchema.index({ price: 1 });
ListingSchema.index({ status: 1, category: 1, transactionType: 1 });

export const Listing: Model<IListing> =
  mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);
