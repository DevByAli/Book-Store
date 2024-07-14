import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Please provide user id."],
      ref: "User"
    },
    orderId: {
      type: String,
      required: [true, "Please provide order id."],
      ref: "Order"
    },
    isUserRead: {
      type: Boolean,
      default: false,
    },
    type: {
      // NO = new order
      // CS = change order
      type: String,
      enum: ["NO", "CS"],
      default: "NO",
    },
    isAdminRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", NotificationSchema);
