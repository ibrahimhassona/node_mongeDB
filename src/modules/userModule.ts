import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
  role: "user" | "admin";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  passwordConfirm: string;
  isAdmin: boolean;
  refreshToken: string;
}

const userScheman = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  passwordChangedAt: { type: Date },
  isAdmin: { type: Boolean, default: false },
  refreshToken: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  active: { type: Boolean, default: false },
});

export const User = model<IUser>("User", userScheman);
