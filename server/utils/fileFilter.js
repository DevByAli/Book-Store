import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "./errorHandler.js";

export const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler(
        "Only .png, .jpg, and .jpeg format allowed!",
        StatusCodes.BAD_REQUEST
      ),
      false
    );
  }
};
