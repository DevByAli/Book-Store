import User from "../models/user.model.js";
import { configDotenv } from "dotenv";

configDotenv("dotenv");

// ***************************************************************
// #region Add Admin
// When the server start then it will add the admin if not exists
// ***************************************************************
const addAdmin = async () => {
  const isAdmin = await User.findOne({ role: process.env.ADMIN_ROLE });

  if (!isAdmin) {
    await User.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: process.env.ADMIN_ROLE,
    });
  }
};

export default addAdmin;
