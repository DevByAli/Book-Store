import Jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv("dotenv");

export const signEmailVerificationToken = (oldEmail, newEmail) => {
  return Jwt.sign({ oldEmail, newEmail }, process.env.UPDATE_EMAIL_TOKEN, {
    expiresIn: "5m",
  });
};
