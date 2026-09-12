import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeroBanner extends Document {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

const HeroBannerSchema = new Schema<IHeroBanner>(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, maxlength: 120 },
    subtitle: { type: String, maxlength: 200 },
    linkUrl: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const HeroBanner: Model<IHeroBanner> =
  mongoose.models.HeroBanner || mongoose.model<IHeroBanner>("HeroBanner", HeroBannerSchema);
