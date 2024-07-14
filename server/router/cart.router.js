import { Router } from "express";
import {
  addToCart,
  decrementBookCount,
  deleteFromCart,
  getAllItems,
} from "../controllers/cart.controller.js";
import isAuthenticated, {
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

export const cartRouter = Router();

cartRouter.post(
  "/add-to-cart",
  isAuthenticated,
  authorizeRoles("user"),
  addToCart
);

cartRouter.delete(
  "/delete-from-cart/:id",
  isAuthenticated,
  authorizeRoles("user"),
  deleteFromCart
);

cartRouter.patch(
  "/decrement-book-count/:id",
  isAuthenticated,
  authorizeRoles("user"),
  decrementBookCount
);

cartRouter.get(
  "/get-all-cart-items",
  isAuthenticated,
  authorizeRoles("user"),
  getAllItems
);
