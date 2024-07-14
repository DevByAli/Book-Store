import { StatusCodes } from "http-status-codes";

import User from "../models/user.model.js";
import sendMail from "../services/mail.service.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import extractPublicId from "../utils/extractPublicId.js";
import asyncMiddleware from "../middlewares/async.middleware.js";
import RegisterValidator from "../validators/register.validator.js";
import ActivationValidator from "../validators/activation.validator.js";
import {
  decodeEmailVerificationToken,
  decodeVerificationToken,
  signUpdateEmailToken,
} from "../utils/token.js";
import { VERIFICATION_TOKEN } from "../utils/constants.js";
import {
  deleteUserOldAvatarFromCloudinary,
  findUser,
  isEmailExists,
} from "../services/user.service.js";
import setVerificationCookie from "../services/register.service.js";
import { createActivationToken } from "../utils/createActivationToken.js";
import { compareVerificationCode } from "../utils/verifyActivationCode.js";
import UpdateUsernameValidator from "../validators/updateUsername.validator.js";
import UpdatePasswordValidator from "../validators/updatePassword.js";
import UpdateEmailValidator from "../validators/UpdateEmail.validator.js";
import EmailVerificationValidator from "../validators/emailVerification.validator.js";
import { createCart } from "../services/cart.service.js";

// *****************************************
// #region Register User
// *****************************************
export const registerUser = asyncMiddleware(async (req, res) => {
  await RegisterValidator.validateAsync(req.body);

  const { username, email } = req.body;

  await isEmailExists(email);

  const { token, activationCode } = await createActivationToken(req.body);

  sendMail({
    email,
    subject: "Activate your account",
    template: "activation-mail.ejs",
    data: { username, activationCode },
  });

  setVerificationCookie(token, res);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: `Verification code send to: ${email}.`,
  });
});

// *****************************************
// #region Activate User
// *****************************************
export const activateUser = asyncMiddleware(async (req, res) => {
  const userActivationCode = req.body.activationCode;
  const token = req.cookies[VERIFICATION_TOKEN];

  await ActivationValidator.validateAsync({ token, userActivationCode });

  const { user, activationCode } = decodeVerificationToken(token);
  await compareVerificationCode(userActivationCode, activationCode);

  const newUser = await User.create(user);
  newUser.password = undefined;
  
  createCart(newUser._id);

  res.clearCookie(VERIFICATION_TOKEN);
  res.status(StatusCodes.CREATED).json({ success: true, user: newUser });
});

// *****************************************
// #region Upload Avatar
// *****************************************
export const updateAvatar = asyncMiddleware(async (req, res) => {
  const user = await findUser({ _id: req.user._id }, "-password");

  deleteUserOldAvatarFromCloudinary(user);

  user.avatar = req.files[0].path;
  user.cloudinaryId = extractPublicId(user.avatar);

  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Profile picture update successfully!",
    user,
  });
});

export const deleteAvatar = asyncMiddleware(async (req, res) => {
  const user = await findUser({ _id: req.user._id }, "-password");

  deleteUserOldAvatarFromCloudinary(user);

  user.avatar = undefined;
  user.cloudinaryId = undefined;
  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Profile picture deleted successfully!",
    user,
  });
});

// *****************************************
// #region Get User
// *****************************************
export const getUserProfile = asyncMiddleware(async (req, res) => {
  const user = await findUser(
    { _id: req.user._id },
    "username email avatar cloudinaryId"
  );

  res.status(StatusCodes.OK).json({ success: true, user });
});

export const updateUserInfo = asyncMiddleware(async (req, res) => {
  const user = await User.findByIdAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
  }).select("-password");

  res
    .status(StatusCodes.OK)
    .json({ success: true, user, msg: "Update Successfully." });
});

// *****************************************
// #region Update User
// *****************************************
export const updateUsername = asyncMiddleware(async (req, res) => {
  await UpdateUsernameValidator.validateAsync(req.body);

  const { username, password } = req.body;

  const user = await findUser({ _id: req.user._id });

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ErrorHandler("Password is incorrect.", StatusCodes.BAD_REQUEST);
  }

  let msg = "Username update successfully.";
  user.username = username;

  await user.save();
  user.password = undefined;

  res.status(StatusCodes.OK).json({ success: true, msg, user });
});

// *****************************************
// #region Update Password
// *****************************************
export const updatePassword = asyncMiddleware(async (req, res) => {
  await UpdatePasswordValidator.validateAsync(req.body);

  const user = await findUser({ _id: req.user._id });

  const isPasswordCorrect = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordCorrect) {
    throw new ErrorHandler("Password is incorrect.", StatusCodes.BAD_REQUEST);
  }

  user.password = req.body.newPassword;
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "Password update successfully." });
});

// *****************************************
// #region Update Email
// *****************************************
export const updateEmail = asyncMiddleware(async (req, res) => {
  await UpdateEmailValidator.validateAsync(req.body);

  const user = await findUser({ _id: req.user._id });

  const isPasswordCorrect = await user.comparePassword(req.body.password);
  if (!isPasswordCorrect) {
    throw new ErrorHandler("Password is incorrect.", StatusCodes.BAD_REQUEST);
  }

  await isEmailExists(req.body.newEmail);

  const token = signUpdateEmailToken(req.body);

  const verificationLink = `http://localhost:3001/profile/verify/${token}`;
  await sendMail({
    email: req.body.newEmail,
    subject: "Activate your account",
    template: "update-email.ejs",
    data: { verificationLink },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    msg: `Verification link send to ${req.body.newEmail}.`,
  });
});

// *****************************************
// #region Verify Email
// *****************************************
export const verifyEmail = asyncMiddleware(async (req, res) => {
  const token = req.params.token;

  await EmailVerificationValidator.validateAsync({ token });

  const { oldEmail, newEmail } = decodeEmailVerificationToken(token);

  await User.findOneAndUpdate(
    { email: oldEmail },
    { $set: { email: newEmail } }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Email update successfully.",
  });
});
