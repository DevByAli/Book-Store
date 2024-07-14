import multer from "multer";
import accountStorage from "../config/accountStorage.js";
import { fileFilter } from "../utils/fileFilter.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { StatusCodes } from "http-status-codes";

const uploadMiddleware = (folderNmae) => {
  return (req, res, next) => {
    const upload = multer({
      storage: accountStorage(folderNmae),
      fileFilter: fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // set file size limit to 5 MB
    });

    upload.any()(req, res, (err) => {
      if (err) {
        next(new ErrorHandler(err.message, StatusCodes.INTERNAL_SERVER_ERROR));
      } else if (!req.files || req.files.length === 0) {
        next(
          new ErrorHandler("Image is not provided.", StatusCodes.BAD_REQUEST)
        );
      } else {
        next();
      }
    });
  };
};

export default uploadMiddleware;
