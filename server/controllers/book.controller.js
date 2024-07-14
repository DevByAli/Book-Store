import { StatusCodes } from "http-status-codes";

import asyncMiddleware from "../middlewares/async.middleware.js";
import Book from "../models/book.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import extractPublicId from "../utils/extractPublicId.js";
import BookValidator from "../validators/book.validator.js";
import SearchBookValidator from "../validators/searchBook.validator.js";

// *****************************************
//#region AddBook
// *****************************************
export const addBook = asyncMiddleware(async (req, res) => {
  await BookValidator.validateAsync(req.body);

  const book = await Book.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    book,
  });
});

// *****************************************
//#region DeleteBook
// *****************************************
export const deleteBook = asyncMiddleware(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    throw new ErrorHandler("Book not found", StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).json({ success: true, msg: "Book deleted!" });
});

// *****************************************
//#region UpdateBook
// *****************************************
export const updateBook = asyncMiddleware(async (req, res) => {
  const book = await Book.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!book) {
    throw new ErrorHandler("Book not found", StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).json({ success: true, book });
});

// *****************************************
//#region GetBook
// *****************************************
export const getBook = asyncMiddleware(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new ErrorHandler("Book not found", StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).json({ success: true, book });
});

// *****************************************
//#region GetBooks
// *****************************************
export const getBooks = asyncMiddleware(async (req, res) => {
  const {
    pageNumber = 1,
    pageSize = 10,
    price,
    purchased,
    title,
    author,
    dateAdded,
  } = req.query;

  const parsedPageNumber = parseInt(pageNumber);
  const parsedPageSize = parseInt(pageSize);

  // Validate input
  if (
    isNaN(parsedPageNumber) ||
    isNaN(parsedPageSize) ||
    parsedPageNumber < 1 ||
    parsedPageSize < 1
  ) {
    throw new ErrorHandler(
      "Invalid pageNumber or pageSize.",
      StatusCodes.BAD_REQUEST
    );
  }

  // Calculate skip and limit for pagination
  const skip = (parsedPageNumber - 1) * parsedPageSize;
  const limit = parsedPageSize;

  // Build the sort object based on sortBy and sortOrder
  let sort = {};

  if (title) {
    sort.title = parseInt(title);
  }
  if (author) {
    sort.author = parseInt(author);
  }
  if (price) {
    sort.price = parseInt(price);
  }
  if (purchased) {
    sort.purchased = parseInt(purchased);
  }
  if (dateAdded) {
    sort.dateAdded = parseInt(dateAdded);
  }

  // Fetch books for the current page with sorting
  const books = await Book.find().skip(skip).limit(limit).sort(sort);

  // Count total number of documents
  const totalBooksCount = await Book.countDocuments();

  // Calculate total number of pages
  const totalPages = Math.ceil(totalBooksCount / parsedPageSize);

  // Calculate whether there are more pages available
  const hasNextPage = skip + limit < totalBooksCount;

  res.status(StatusCodes.OK).json({
    success: true,
    books,
    totalPages,
    hasNextPage,
  });
});

export const uploadCover = asyncMiddleware(async (req, res) => {
  const url = req.files[0].path;
  const cloudinaryId = extractPublicId(req.files[0].filename);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Image uploaded.",
    url,
    cloudinaryId,
  });
});

export const searchBooks = asyncMiddleware(async (req, res) => {
  await SearchBookValidator.validateAsync(req.query);

  const {
    query,
    deepSearch,
    pageNumber = 1,
    pageSize = 10,
    price,
    purchased,
    title,
    author,
    dateAdded,
  } = req.query;

  const regex = new RegExp(query, "i");
  const parsedPageNumber = parseInt(pageNumber, 10);
  const parsedPageSize = parseInt(pageSize, 10);

  // Calculate skip and limit for pagination
  const skip = (parsedPageNumber - 1) * parsedPageSize;
  const limit = parsedPageSize;

  let searchCriteria = [
    { title: { $regex: regex } },
    { author: { $regex: regex } },
  ];

  if (deepSearch === "true") {
    searchCriteria = searchCriteria.concat([
      { tags: { $regex: regex } },
      { description: { $regex: regex } },
    ]);
  }

  // Build the sort object based on the provided filters
  let sort = {};

  if (title) {
    sort.title = parseInt(title);
  }
  if (author) {
    sort.author = parseInt(author);
  }
  if (price) {
    sort.price = parseInt(price);
  }
  if (purchased) {
    sort.purchased = parseInt(purchased);
  }
  if (dateAdded) {
    sort.dateAdded = parseInt(dateAdded);
  }

  // Fetch books for the current page with sorting
  const books = await Book.find({ $or: searchCriteria })
    .skip(skip)
    .limit(limit)
    .sort(sort);

  // Count total number of documents matching the query
  const totalBooksCount = await Book.countDocuments({ $or: searchCriteria });

  // Calculate total number of pages
  const totalPages = Math.ceil(totalBooksCount / parsedPageSize);

  // Calculate whether there are more pages available
  const hasNextPage = parsedPageNumber < totalPages;

  res.status(StatusCodes.OK).json({
    success: true,
    books,
    totalPages,
    hasNextPage,
  });
});
