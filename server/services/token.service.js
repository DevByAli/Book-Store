import { configDotenv } from "dotenv";
import Jwt from "jsonwebtoken";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";

configDotenv("dotenv");

const FiveMinutes = 5 * 60 * 1000;
const OneWeek = 7 * 24 * 60 * 60 * 1000;

// options for cookies
export const accessTokenOptions = {
  expires: new Date(Date.now() + FiveMinutes),
  maxAge: FiveMinutes,
};

export const refreshTokenOptions = {
  expires: new Date(Date.now() + OneWeek),
  maxAge: OneWeek,
};

// *****************************************
// #region Send Token for Login
// *****************************************
export const sendToken = (user, res) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  res.cookie(REFRESH_TOKEN, refreshToken, {
    expires: new Date(Date.now() + OneWeek),
    maxAge: OneWeek,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "login successfully",
    token: accessToken,
  });
};

// *****************************************
// #region Refresh Access Token
// *****************************************
export const refreshAccessToken = async (oldRefreshToken, req, res) => {
  const { id } = Jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(id);

  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  req.user = user;

  res.cookie(REFRESH_TOKEN, refreshToken, refreshTokenOptions);

  return accessToken;
};
