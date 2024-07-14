import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { StatusCodes } from "http-status-codes";

// *****************************************
// #region Create User
// *****************************************
export const createUser = async (user) => {
  await User.create({
    username: user.username,
    email: user.email,
    password: user.password,
  });
};

export const findUser = async (query, filter) => {
  const user = await User.findOne(query).select(filter);
  if (!user) {
    throw new ErrorHandler("User not found.", StatusCodes.NOT_FOUND);
  }

  return user;
};

export const isEmailExists = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new ErrorHandler("Email already exists.", StatusCodes.CONFLICT);
  }
  return false;
};

export const deleteUserOldAvatarFromCloudinary = async (user) => {
  if (user.avatar && user.cloudinaryId) {
    await cloudinary.api.delete_resources([`Avatars/${user.cloudinaryId}`], {
      type: "upload",
      resource_type: "image",
    });
  }
};