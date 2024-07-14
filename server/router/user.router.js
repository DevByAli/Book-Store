import { Router } from "express";
import uploadMiddleware from "../middlewares/upload.middleware.js";
import {
  getUserProfile,
  registerUser,
  updateAvatar,
  deleteAvatar,
  activateUser,
  verifyEmail,
  updateUserInfo,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

export const userRouter = Router();

userRouter.post(
  "/upload-avatar",
  isAuthenticated,
  uploadMiddleware("Avatars"),
  updateAvatar
);

userRouter.delete("/delete-avatar", isAuthenticated, deleteAvatar);
userRouter.post("/register-user", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.patch("/update-user-profile-info", isAuthenticated, updateUserInfo);
userRouter.patch("/verify-email/:token", isAuthenticated, verifyEmail);
userRouter.get("/get-user-profile-info", isAuthenticated, getUserProfile);
