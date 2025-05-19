import { NextFunction, Request, Response } from "express";
import { User } from "../modules/userModule";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";
import jwt from "jsonwebtoken";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Please provide email and password" });

    //   -- Search for the user in the database --
    const user = (await User.findOne({ email }).select("+password")) as {
      _id: any;
      password: string;
    };
    // -- check if the password is correct --
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });
    // -- create tokens --
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // -- Send the refresh token as a cookie --
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

// -------- Renew Token --------
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  try {
    // -- Verify the refresh token --
    const decodded: any = jwt.verify(token, process.env.REFRESH_SECRET!);
    // -- Create a new access token --
    const newAccessToken = generateAccessToken(decodded.userId);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};
// ------- Logout --------
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  try {
    if (!req.cookies.refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
// -------- Register User --------
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    // Verify that the email address has not been used previously.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }
    // Encrypt the password and create the user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// -------- Update Password --------
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { password, newPassword } = req.body;
    if (!password || !newPassword)
      return res
        .status(400)
        .json({ message: "Please provide current and new password" });
    // -- Check if the user exists --
    const user = await User.findById((req as any).user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });
    // -- Check if the current password is correct --
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    // -- Update the password --
    user.password = await bcrypt.hash(newPassword, 12);;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
