import mongoose from "mongoose";

const UsersWithOrderCount = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Provide user id"],
    unique: true,
    ref: "User"
  },
  count: {
    type: Number,
    default: 0,
  },
  orderIds: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "Order"
  },
});

export default mongoose.model("UserWithOrderCount", UsersWithOrderCount);