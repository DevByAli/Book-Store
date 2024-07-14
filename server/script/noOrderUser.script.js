import mongoose from "mongoose";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import noOrderUserModel from "../script.models/noOrderUser.model.js";

const findUsersWithoutOrders = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ali:GR7EW8AL6@cluster0.9crwdxu.mongodb.net/",
      { dbName: "BookStore" }
    );

    console.log("Db connected");

    const users = await User.find({ role: "user" }).select(
      "_id username email"
    );

    const orders = await Order.find();

    const userIdsWithOrders = new Set(
      orders.map((order) => order.user.toString())
    );

    const usersWithoutOrders = users.filter(
      (user) => !userIdsWithOrders.has(user._id.toString())
    );

    const formattedResponse = usersWithoutOrders.map(({ username, email }) => ({
      username,
      email,
    }));

    await noOrderUserModel.deleteMany();
    await noOrderUserModel.insertMany(formattedResponse);

    const userWithNoOrder = await noOrderUserModel.find();

    console.log(userWithNoOrder);
  } catch (error) {
    console.error("Error finding users without orders:", error);
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
};

findUsersWithoutOrders();
