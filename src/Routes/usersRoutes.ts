import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";
const router = express.Router();
router.get("/", protect, getAllUsers);
router.post("/", createUser);
router.get("/:id", protect, getUser);
router.delete("/:id", protect, deleteUser);
router.patch("/:id", protect, updateUser);
export default router;
