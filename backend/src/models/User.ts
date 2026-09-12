import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "client" | "owner" | "admin";
export type KycStatus = "non_soumis" | "en_attente" | "verifie" | "rejete";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  isSuspended: boolean;
  avatarUrl?: string;
  kycStatus: KycStatus;
  kycDocumentUrl?: string;
  kycSubmittedAt?: Date;
  kycNote?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["client", "owner", "admin"],
      default: "client",
    },
    isSuspended: { type: Boolean, default: false },
    avatarUrl: { type: String },
    kycStatus: {
      type: String,
      enum: ["non_soumis", "en_attente", "verifie", "rejete"],
      default: "non_soumis",
    },
    kycDocumentUrl: { type: String },
    kycSubmittedAt: { type: Date },
    kycNote: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
