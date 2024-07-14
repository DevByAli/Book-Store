import Order from "../models/order.model.js";
import mongoose from "mongoose";

// Import necessary modules and dependencies

// Function to change order status to "pending"
async function changeOrderStatus() {
  try {
    await mongoose.connect(
      "mongodb+srv://ali:GR7EW8AL6@cluster0.9crwdxu.mongodb.net/",
      { dbName: "BookStore" }
    );
    console.log("Connected to MongoDB");
    // Find all orders
    const orders = await Order.find();

    // Loop through each order and update the status to "pending"
    for (let i = 0; i < orders.length; i++) {
      orders[i].status = "pending";
      await orders[i].save();
    }

    console.log('Order status changed to "pending" for all orders.');
  } catch (error) {
    console.error("Error occurred while changing order status:", error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

// Call the function to change order status
changeOrderStatus();
