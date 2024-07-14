import { Router } from "express";
import isAuthenticated, {
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
  getAllUnreadNotificationsOfAdmin,
  getUnreadNotificationsOfAUser,
  markAllNotificationsAsReadOfAdmin,
  markAllNotificationsAsReadOfUser,
} from "../controllers/notification.controller.js";

export const notificationRouter = Router();

notificationRouter.get(
  "/get-unread-user-notifications",
  isAuthenticated,
  authorizeRoles("user"),
  getUnreadNotificationsOfAUser
);

notificationRouter.patch(
  "/mark-all-as-read-user-notifications",
  isAuthenticated,
  authorizeRoles("user"),
  markAllNotificationsAsReadOfUser
);

// ***************************************
// ----------For admin use----------------
// ***************************************

notificationRouter.get(
  "/get-unread-admin-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUnreadNotificationsOfAdmin
);

notificationRouter.patch(
  "/mark-all-as-read-admin-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  markAllNotificationsAsReadOfAdmin
);
