import mongoose from "mongoose";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import UserWithOrderCount from "../script.models/UserWithOrderCount.model.js";

const UsersWithOrderCount = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ali:GR7EW8AL6@cluster0.9crwdxu.mongodb.net/",
      { dbName: "BookStore" }
    );

    console.log("Db connected");

    const result = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
          orders: { $push: "$_id" },
        },
      },
      {
        $project: {
          userId: "$_id",
          count: 1,
          orderIds: "$orders",
        },
      },
    ]);

    for (const entry of result) {
      await UserWithOrderCount.updateOne(
        { userId: entry.userId },
        {
          $set: { count: entry.count },
          $addToSet: { orderIds: entry.orderIds },
        },
        { upsert: true }
      );
    }

    console.log(await UserWithOrderCount.find().populate("orderIds userId"));
  } catch (error) {
    console.log(error);
  }finally{
    await mongoose.disconnect()
    process.exit(0)
  }
};

UsersWithOrderCount();
