import bcrypt from "bcrypt";
import { ErrorHandler } from "./errorHandler.js";
import { StatusCodes } from "http-status-codes";

export const compareVerificationCode = async (userCode, tokenCode) => {
  const isValid = await bcrypt.compare(userCode, tokenCode)
  if(!isValid){
    throw new ErrorHandler('Invalid verification code.', StatusCodes.BAD_REQUEST)
  }
};
