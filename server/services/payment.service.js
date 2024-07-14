import { StatusCodes } from "http-status-codes";
import { SHIPPING_PRICE } from "../utils/constants.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { configDotenv } from "dotenv";
import { Stripe } from "stripe";
import { modifyCloudinaryUrl } from "../utils/modifyCloudinaryUrl.js";

configDotenv("dotenv");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createLineItems = (items) => {
  return items.map(({ book, quantity }) => {
    const modifiedUrl = modifyCloudinaryUrl(book.url, 40, 40);

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: book.title,
          images: [modifiedUrl],
        },
        unit_amount: book.price * 100,
      },
      quantity,
    };
  });
};

export const createStripeSession = async ({ customerEmail, line_items }) => {
  return await stripe.checkout.sessions.create({
    customer_email: customerEmail,
    line_items,
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["PK", "US", "CN", "IN", "AE", "GB"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: SHIPPING_PRICE, currency: "usd" },
          display_name: "Standard shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],
    success_url: `${process.env.PAYMENT_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PAYMENT_CANCEL_URL}`,
  });
};

export const reteriveStripeSession = async (session_id) => {
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["payment_intent.payment_method"],
  });

  if (!session) {
    throw new ErrorHandler("Invalid session id.", StatusCodes.BAD_REQUEST);
  }

  return session;
};

export const getLineItemsList = async (session_id) => {
  return await stripe.checkout.sessions.listLineItems(session_id);
};

export const createRefund = async (refundId) => {
  const charge = await stripe.charges.retrieve(refundId);

  const totalAmount = charge.amount;

  return await stripe.refunds.create({
    charge: refundId,
    amount: totalAmount,
  });
};
