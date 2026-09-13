import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IReview extends Document {
  reviewer: Types.ObjectId;
  reviewedUser: Types.ObjectId;
  rating: number;
  comment?: string;
  listing?: Types.ObjectId;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedUser: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
