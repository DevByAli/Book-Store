import { StatusCodes } from "http-status-codes";
import ayncMiddleware from "../middlewares/async.middleware.js";
import Order from "../models/order.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";

export const getEarnings = ayncMiddleware(async (req, res) => {
  const { period } = req.query; // Expecting 'week', 'month', or 'year'

  let matchCondition = { status: { $ne: "cancelled" } };

  switch (period) {
    case "week":
      matchCondition.createdAt = {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      };
      break;
    case "month":
      matchCondition.createdAt = {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      };
      break;
    case "year":
      matchCondition.createdAt = {
        $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      };
      break;
    default:
      throw new ErrorHandler(
        "Please specify period 'week', 'month', or 'year'.",
        StatusCodes.BAD_REQUEST
      );
  }

  const earnings = await Order.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$totalAmount" },
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    earnings: earnings[0] ? earnings[0].totalEarnings : 0,
  });
});

// Get most selling books using aggregation
export const getMostSellingBooks = async (req, res) => {
  const mostSellingBooks = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.book",
        totalQuantity: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    { $unwind: "$bookDetails" },
    {
      $project: {
        _id: 0,
        bookId: "$_id",
        title: "$bookDetails.title",
        author: "$bookDetails.author",
        purchased: "$bookDetails.purchased",
        url: "$bookDetails.url",
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    mostSellingBooks,
  });
};

// Get top 5 countries where books are most sold
export const getTopCountriesByBookSales = async (req, res) => {
  const topCountries = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$shippingAddress.country",
        totalQuantity: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        country: "$_id",
        totalQuantity: 1,
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    topCountries,
  });
};


// Get most selling book tags
export const getMostSellingBookTags = async (req, res) => {
  const mostSellingTags = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "books",
        localField: "items.book",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
    { $unwind: "$book.tags" },
    {
      $group: {
        _id: "$book.tags",
        totalQuantity: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalQuantity: -1 } },
    {
      $project: {
        _id: 0,
        tag: "$_id",
        totalQuantity: 1,
      },
    },
    { $limit: 10 },
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    mostSellingTags,
  });
};
