import { StatusCodes } from "http-status-codes";
import Order from "../models/order.model.js";
import formatOrder from "../utils/formatOrder.js";
import { findBookIdByTitle, findBooks } from "./book.service.js";
import sendMail from "./mail.service.js";

export const sendMailOfOrderToCustomer = async (order, email) => {
  const booksDetails = await findBooks(order);
  const emailData = [];

  booksDetails.forEach((book) => {
    const data = {
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: order.items.find(
        (item) => item.book.toString() === book._id.toString()
      ).quantity,
    };
    emailData.push(data);
  });
  emailData.push({
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
  });

  await sendMail({
    email,
    subject: "Order Details",
    template: "order-summary.ejs",
    data: emailData,
  });
};

export const createOrderItems = async (data) => {
  const items = await Promise.all(
    data.map(async (item) => {
      const book = await findBookIdByTitle(item.description);
      return {
        book: book._id.toString(),
        quantity: item.quantity,
      };
    })
  );

  return items;
};

export const findPaymentIntent = async (paymentIntent) => {
  const result = await Order.findOne({
    "paymentResult.paymentIntent": paymentIntent,
  });
  
  return result;
};

export const getOrders = async (req, res) => {
  const { page = 1, limit = 10, order = "1", status } = req.query;
  const userId = req.user._id;
  const isAdmin = req.user.role === "admin";

  const filter = {};
  if (!isAdmin) {
    filter["user"] = userId;
  }
  if (status) {
    filter.status = status;
  }

  const options = {
    sort: { createdAt: order ? parseInt(order, 10) : 1 },
    limit: parseInt(limit, 10),
    skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
  };

  const [orders, totalOrdersCount] = await Promise.all([
    Order.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .populate({
        path: "items.book",
        select: "title price author url",
      })
      .populate({
        path: "user",
        select: "username avatar email",
      }),
    Order.countDocuments(filter),
  ]);

  const formattedOrders = formatOrder(orders);

  const hasNextPage = totalOrdersCount > options.skip + options.limit;

  res.status(StatusCodes.OK).json({
    success: true,
    orders: formattedOrders,
    hasNextPage,
  });
};
