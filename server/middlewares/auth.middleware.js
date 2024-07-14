import { StatusCodes } from "http-status-codes";
import { REFRESH_TOKEN } from "../utils/constants.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import asyncMiddleware from "./async.middleware.js";
import { refreshAccessToken } from "../services/token.service.js";

const isAuthenticated = asyncMiddleware(async (req, res, next) => {
  const refreshToken = req.cookies[REFRESH_TOKEN];

  if (!refreshToken) {
    throw new ErrorHandler(
      "No tokens provided. Please log in.",
      StatusCodes.UNAUTHORIZED
    );
  }

  if (refreshToken) {
    try {
      await refreshAccessToken(refreshToken, req, res);
      return next();
    } catch (refreshError) {
      throw new ErrorHandler(
        "Session expired. Please log in again.",
        StatusCodes.UNAUTHORIZED
      );
    }
  }
});

export const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorHandler(
        `Role: ${req.user?.role} is not allowed to access this resource.`,
        StatusCodes.FORBIDDEN
      );
    } else {
      next();
    }
  };
};

export default isAuthenticated;
