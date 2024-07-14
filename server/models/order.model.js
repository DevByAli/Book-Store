import mongoose from "mongoose";

import Book from "../models/book.model.js";

const errorMsg = (msg) => `Please provide the ${msg} for the order.`;

const orderItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, errorMsg("book id")],
  },
  quantity: {
    type: Number,
    required: [true, errorMsg("book quantity")],
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, errorMsg("user id")],
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: [true, errorMsg("total amount")],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      line1: {
        type: String,
        required: [true, errorMsg("line1 address")],
      },
      line2: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        required: [true, errorMsg("city")],
      },
      postal_code: {
        type: String,
        required: [true, errorMsg("postal code")],
      },
      country: {
        type: String,
        required: [true, errorMsg("country")],
      },
      state: {
        type: String,
        default: null,
      },
    },
    paymentMethod: {
      type: String,
      default: "stripe",
    },
    paymentResult: {
      paymentIntent: {
        type: String,
        required: [true, errorMsg("stripe payment intent of payment")],
      },
      refundId: {
        type: String,
        required: [true, errorMsg("payment refund id")],
      },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.post("save", async function (doc) {
  for (const item of doc.items) {
    await Book.findByIdAndUpdate(item.book, {
      $inc: { purchased: item.quantity },
    });
  }
});

export default mongoose.model("Order", orderSchema);
