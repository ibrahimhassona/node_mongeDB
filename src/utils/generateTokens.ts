import jwt from "jsonwebtoken";

const REFRESH_SECRET_EXPIRES ="7d";
const ACCESS_SEVRET_EXPIRES = "15m";

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.ACCESS_SEVRET!,
    { expiresIn: ACCESS_SEVRET_EXPIRES }
  );
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET!, { expiresIn: REFRESH_SECRET_EXPIRES });
};

export { generateAccessToken, generateRefreshToken };
