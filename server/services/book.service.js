import { v2 as cloudinary } from "cloudinary";

import Book from "../models/book.model.js";

export const findBooks = async ({ items }) => {
  const bookIds = items.map((item) => item.book);
  const existingBooks = await Book.find({ _id: { $in: bookIds } });

  return existingBooks;
};

export const findBookIdByTitle = async (title) => {
  return await Book.findOne({ title }).select("_id");
};

export const deleteBookOldCoverFromCloudinary = async (book) => {
  if (book.url && book.cloudinaryId) {
    await cloudinary.api.delete_resources([`BookCovers/${book.cloudinaryId}`], {
      type: "upload",
      resource_type: "image",
    });
  }
};
