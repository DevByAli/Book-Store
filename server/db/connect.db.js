import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import addAdmin from "../services/admin.service.js";

configDotenv("dotenv");

const DB_URL = process.env.DB_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
      dbName: "BookStore",
      connectTimeoutMS: 30000,
      ssl: true
    });
    console.log("DB connected!");

    addAdmin();
  } catch (error) {
    setTimeout(connectDB, 5000);
  }
};
