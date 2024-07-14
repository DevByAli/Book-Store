import mongoose from "mongoose";
import Cart from "../models/cart.model.js"; // Adjust the import according to your project structure
import Sync from "../script.models/sync.model.js"; // Adjust the import according to your project structure
import { connectDB } from "../db/connect.js";

const syncScript = async () => {
  try {
    await connectDB();

    const cartDocuments = await Cart.find();

    await Sync.deleteMany();

    await Sync.insertMany(cartDocuments);

    console.log("Sync successful.");
  } catch (error) {
    console.error("Error during sync:", error);
  }
};

syncScript();
