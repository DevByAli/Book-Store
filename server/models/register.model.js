import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv("dotenv");

const errorMsg = (msg) => `Please provide the ${msg} for registeration.`;

const RegisterSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, errorMsg("username")],
      trim: true,
    },
    email: {
      type: String,
      required: [true, errorMsg("email")],
      trim: true,
    },
    password: {
      type: String,
      required: [true, errorMsg("password")],
    },
    activationCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

RegisterSchema.methods.SignActivationToken = function () {
  return Jwt.sign({ email: this.email }, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "2m",
  });
};

RegisterSchema.methods.VerifyToken = function (token) {
  return Jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);
};

export default mongoose.model("Register", RegisterSchema);
