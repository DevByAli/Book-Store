import { StatusCodes } from "http-status-codes";
import { configDotenv } from "dotenv";

import Order from "../models/order.model.js";
import asyncMiddleware from "../middlewares/async.middleware.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import OrderValidator from "../validators/order.validator.js";
import {
  createOrderItems,
  findPaymentIntent,
  getOrders,
  sendMailOfOrderToCustomer,
} from "../services/order.service.js";
import { clearCart } from "../services/cart.service.js";
import {
  createLineItems,
  createRefund,
  createStripeSession,
  getLineItemsList,
  reteriveStripeSession,
} from "../services/payment.service.js";
import notificationModel from "../models/notification.model.js";
import { createNotification } from "../services/notification.service.js";

configDotenv("dotenv");

// *****************************************
// #region Checkout
// *****************************************
export const checkout = asyncMiddleware(async (req, res) => {
  const { items } = req.body;

  const line_items = createLineItems(items);

  const details = { customerEmail: req.user.email, line_items };

  const { url } = await createStripeSession(details);

  res.status(StatusCodes.OK).json({
    success: true,
    sessionUrl: url,
  });
});

// *****************************************
// #region Create Order
// *****************************************
export const createOrder = asyncMiddleware(async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    throw new ErrorHandler(
      "Provide the stripe session id.",
      StatusCodes.BAD_REQUEST
    );
  }

  const session = await reteriveStripeSession(session_id);

  const isOrderAlreadyCreate = await findPaymentIntent(
    session.payment_intent.id
  );
  if (isOrderAlreadyCreate) {
    throw new ErrorHandler("Order Already Created.", StatusCodes.BAD_REQUEST);
  }

  const order = {};
  if (session.payment_intent.status === "succeeded") {
    order["user"] = req.user._id.toString();

    const { data } = await getLineItemsList(session_id);

    order["items"] = await createOrderItems(data);
    order["totalAmount"] = session.amount_total / 100;
    order["shippingAddress"] = session.shipping_details.address;
    order["paymentResult"] = {
      paymentIntent: session.payment_intent.id,
      refundId: session.payment_intent.latest_charge,
    };

    await OrderValidator.validateAsync(order);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      msg: "Payment not verified.",
    });
  }

  sendMailOfOrderToCustomer(order, req.user.email);

  const orderResponse = await Order.create(order);

  createNotification(order["user"], orderResponse._id);

  await clearCart(order["user"]);

  res.status(StatusCodes.CREATED).json({
    success: true,
    order: orderResponse,
    msg: "Order created successfully.",
  });
});

// *****************************************
// #region Get orders --- for user
// *****************************************
export const getUserOrders = asyncMiddleware(async (req, res) => {
  await getOrders(req, res);
});

// *****************************************
// #region Get orders --- for admin
// *****************************************
export const getAllOrders = asyncMiddleware(async (req, res) => {
  await getOrders(req, res);
});

// *****************************************
// #region Get order
// *****************************************
export const getOrderById = asyncMiddleware(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "username email")
    .populate({
      path: "items.book",
      select: "title price author",
    })
    .select({ paymentResult: 0 });

  if (!order) {
    throw new ErrorHandler("Order not found", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({ success: true, order });
});

// *****************************************
// #region Update status
// *****************************************
export const updateOrderStatus = asyncMiddleware(async (req, res) => {
  const { orderId, status } = req.body;

  if (!status || status === undefined) {
    throw new ErrorHandler(
      "Provide the status of the order",
      StatusCodes.BAD_REQUEST
    );
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status } },
    { new: true, runValidators: true }
  ).select("_id status user paymentResult");

  if (!order) {
    throw new ErrorHandler("Order not found", StatusCodes.NOT_FOUND);
  }

  if (status === "cancelled") {
    console.log("Order cancelled id:", order);
    await createRefund(order.paymentResult.refundId);
  }

  order.paymentResult = undefined

  res.status(StatusCodes.OK).json({ success: true, order });
});

// *****************************************
// #region Delete order
// *****************************************
export const deleteOrder = asyncMiddleware(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    throw new ErrorHandler("Order not found", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.NO_CONTENT).end();
});
