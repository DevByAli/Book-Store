import { StatusCodes } from "http-status-codes";
import asyncMiddleware from "../middlewares/async.middleware.js";
import Cart from "../models/cart.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";

// *****************************************
// #region Add To Cart
// *****************************************
export const addToCart = asyncMiddleware(async (req, res) => {
  const { id: bookId } = req.body;
  const userId = req.user._id.toString();

  let cart = await Cart.findOne({ user: userId });


  const existingItem = cart.items.find(
    (item) => item.book.toString() === bookId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ book: bookId, quantity: 1 });
  }

  await cart.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Book added to cart successfully",
    cart,
  });
});

// *****************************************
// #region Decrement Book Count From Cart
// *****************************************
export const decrementBookCount = asyncMiddleware(async (req, res) => {
  const { id: bookId } = req.params;
  const userId = req.user._id.toString();

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ErrorHandler("Boot not found in cart.", StatusCodes.BAD_REQUEST);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.book.toString() === bookId
  );

  if (itemIndex === -1) {
    throw new ErrorHandler("Book not found in cart.", StatusCodes.BAD_REQUEST);
  }

  const item = cart.items[itemIndex];

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart.items.splice(itemIndex, 1); // remove book from cart
  }

  await cart.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Book removed from cart successfully",
    cart,
  });
});

// *****************************************
// #region Delete the Book from the Cart
// *****************************************
export const deleteFromCart = asyncMiddleware(async (req, res) => {
  const { id: bookId } = req.params;
  const userId = req.user._id.toString();

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ErrorHandler("Book not found in cart.", StatusCodes.BAD_REQUEST);
  }

  const bookIndex = cart.items.findIndex(
    (item) => item.book.toString() === bookId
  );

  if (bookIndex === -1) {
    throw new ErrorHandler("Book not found in cart.", StatusCodes.BAD_REQUEST);
  }

  cart.items.splice(bookIndex, 1);

  await cart.save();

  res.status(StatusCodes.NO_CONTENT).json({
    success: true,
    msg: "Book deleted from cart successfully!",
  });
});

// *****************************************
// #region Get All Items
// *****************************************
export const getAllItems = asyncMiddleware(async (req, res) => {
  const userId = req.user._id.toString();
  const cart = await Cart.findOne({ user: userId }).populate("items.book");

  if (!cart) {
    throw new ErrorHandler("Cart not found.", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    items: cart.items,
  });
});
