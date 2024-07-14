import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import Jwt from "jsonwebtoken";

configDotenv("dotenv");

const errorMsg = (msg) => `Please provide the user ${msg}.`;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, errorMsg("name")],
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
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    cloudinaryId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Sign Access Token
UserSchema.methods.SignAccessToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
      avatar: this.avatar,
      cloudinaryId: this.cloudinaryId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );
};

UserSchema.methods.SignRefreshToken = function () {
  return Jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
