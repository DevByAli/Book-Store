import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  checkout,
} from "../controllers/order.controller.js";
import isAuthenticated, {
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

export const orderRouter = Router();

orderRouter.post(
  "/checkout",
  isAuthenticated,
  authorizeRoles("user"),
  checkout
);

orderRouter.post(
  "/create-order",
  isAuthenticated,
  authorizeRoles("user"),
  createOrder
);

orderRouter.get(
  "/get-user-orders",
  isAuthenticated,
  authorizeRoles("user"),
  getUserOrders
);

orderRouter.get(
  "/get-order/:id",
  isAuthenticated,
  authorizeRoles("user", "admin"),
  getOrderById
);

orderRouter.patch(
  "/update-order-staus",
  isAuthenticated,
  updateOrderStatus
);

orderRouter.delete(
  "/delete-order/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteOrder
);

orderRouter.get(
  "/get-all-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);
