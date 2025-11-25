import express from "express";
import {
  registerUser,
  getAllUsers,
  getUser,
  updateUserProfile,
  removeUser,
  loginUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

router
  .route("/")
  .get(protect, authorize("admin"), getAllUsers);

router
  .route("/:id")
  .get(protect, getUser)
  .put(protect, updateUserProfile)
  .delete(protect, authorize("admin"), removeUser);

export default router;
