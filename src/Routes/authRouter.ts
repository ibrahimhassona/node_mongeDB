import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
  updatePassword,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.patch("/forgot-password",protect,updatePassword);
export default router;
