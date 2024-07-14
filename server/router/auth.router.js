import { Router } from "express";
import {
  getFreshToken,
  login,
  logout,
} from "../controllers/auth.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/logout", isAuthenticated, logout);
authRouter.get("/refresh-token", isAuthenticated, getFreshToken);
