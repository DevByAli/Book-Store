import Jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv("dotenv");

export const decodeVerificationToken = (token) => {
  return Jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);
};

export const decodeEmailVerificationToken = (token) => {
  const { oldEmail, newEmail } = Jwt.verify(
    token,
    process.env.UPDATE_EMAIL_TOKEN
  );
  return { oldEmail, newEmail };
};

export const signUpdateEmailToken = ({ oldEmail, newEmail }) => {
  return Jwt.sign({ oldEmail, newEmail }, process.env.UPDATE_EMAIL_TOKEN);
};
