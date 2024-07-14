import { StatusCodes } from "http-status-codes";

import ayncMiddleware from "../middlewares/async.middleware.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import User from "../models/user.model.js";
import LoginValidator from "../validators/login.validator.js";
import { refreshAccessToken, sendToken } from "../services/token.service.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants.js";
import asyncMiddleware from "../middlewares/async.middleware.js";

// *****************************************
// #region Login
// *****************************************
export const login = ayncMiddleware(async (req, res) => {
  await LoginValidator.validateAsync(req.body);

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorHandler(
      "Invalid email or password.",
      StatusCodes.BAD_REQUEST
    );
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ErrorHandler(
      "Invalid email or password",
      StatusCodes.BAD_REQUEST
    );
  }

  sendToken(user, res);
});

// *****************************************
// #region Logout
// *****************************************
export const logout = ayncMiddleware(async (req, res) => {
  res.clearCookie(REFRESH_TOKEN);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Logged out successfully!",
  });
});

// *****************************************
// #region Refresh Access Token
// *****************************************
export const getFreshToken = asyncMiddleware(async (req, res) => {
  const token = await refreshAccessToken(req.cookies[REFRESH_TOKEN], req, res);

  res.status(StatusCodes.OK).json({ success: true, token });
});
