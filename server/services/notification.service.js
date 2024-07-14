import Notification from "../models/notification.model.js";
import cron from "node-cron";

export const createNotification = async (uId, oId, notificationType = "NO") => {
  try {
    const { orderId } = await Notification.create({
      userId: uId,
      orderId: oId,
      type: notificationType,
    });

    const notification = await Notification.findOne({ orderId })
      .populate({
        path: "userId",
        select: "username avatar",
      })
      .select("createdAt userId orderId type");

    return {
      createdAt: notification.createdAt,
      username: notification.userId.username,
      avatar: notification.userId.avatar,
      orderId: notification.orderId,
      userId: notification.userId._id,
      type: notification.type,
    };
  } catch (error) {
    console.log(error.message);
  }
};

// Function to delete all notifications
const deleteAllNotifications = async () => {
  try {
    await Notification.deleteMany();
    console.log("All notifications deleted successfully.");
  } catch (error) {
    console.log(error.message);
  }
};

// Schedule the deletion at midnight
export const deleteNotifications = () => {
  cron.schedule("0 0 * * *", deleteAllNotifications);
};
