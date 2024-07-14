import { StatusCodes } from "http-status-codes";
import asyncMiddleware from "../middlewares/async.middleware.js";
import Notification from "../models/notification.model.js";

export const getUnreadNotificationsOfAUser = asyncMiddleware(
  async (req, res) => {
    const notifications = await Notification.find({
      userId: req.user._id,
      isUserRead: false,
    }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ success: true, notifications });
  }
);

export const markAllNotificationsAsReadOfUser = asyncMiddleware(
  async (req, res) => {
    await Notification.updateMany(
      {
        userId: req.user._id,
      },
      {
        $set: {
          isUserRead: true,
        },
      }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "All notification mark as read.",
    });
  }
);

// ***************************************
// ----------For admin use----------------
// ***************************************

export const getAllUnreadNotificationsOfAdmin = asyncMiddleware(
  async (req, res) => {
    const notifications = await Notification.find({ isAdminRead: false, type: 'NO' })
      .populate({
        path: "userId",
        select: "username avatar",
      })
      .sort({ createdAt: -1 })
      .select("createdAt userId orderId type");

    const formattedNotifications = notifications.map((notification) => ({
      createdAt: notification.createdAt,
      username: notification.userId.username,
      avatar: notification.userId.avatar,
      orderId: notification.orderId,
      userId: notification.userId._id,
      type: notification.type,
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      notifications: formattedNotifications,
    });
  }
);

export const markAllNotificationsAsReadOfAdmin = asyncMiddleware(
  async (req, res) => {
    await Notification.updateMany(
      {},
      {
        $set: {
          isAdminRead: true,
        },
      }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "All notification mark as read.",
    });
  }
);
