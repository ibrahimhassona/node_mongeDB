import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
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

const userSchema = new Schema<IUser>({
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
export const User = model<IUser>("User", userSchema);
