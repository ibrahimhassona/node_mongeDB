import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";
const router = express.Router();
router.get("/", protect, isAdmin, getAllUsers);
router.post("/", createUser);
router.get("/:id", protect, getUser);
router.delete("/:id", protect, deleteUser);
router.patch("/:id", protect, isAdmin, updateUser);
export default router;
