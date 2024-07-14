import { Router } from "express";
import {
  addBook,
  deleteBook,
  getBook,
  getBooks,
  searchBooks,
  updateBook,
  uploadCover,
} from "../controllers/book.controller.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";
import isAuthenticated, {
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

export const bookRouter = Router();

bookRouter.post("/add-book", isAuthenticated, authorizeRoles("admin"), addBook);

bookRouter.delete(
  "/delete-book/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBook
);

bookRouter.patch(
  "/update-book/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateBook
);

bookRouter.post(
  "/upload-cover",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadMiddleware("BookCovers"),
  uploadCover
);

// these are the public routes
bookRouter.get("/get-books", getBooks);
bookRouter.get("/get-book/:id", getBook);
bookRouter.get("/search-book", searchBooks);
