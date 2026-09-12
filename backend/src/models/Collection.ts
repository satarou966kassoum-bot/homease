import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICollection extends Document {
  owner: Types.ObjectId;
  name: string;
  listings: Types.ObjectId[];
  createdAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    listings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema);
