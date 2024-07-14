import mongoose from "mongoose";

const socketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID for socket is required"],
  },
  socketId: {
    type: String,
    required: [true, "Socket ID is required"],
  },
});

export default mongoose.model("Socket", socketSchema);

