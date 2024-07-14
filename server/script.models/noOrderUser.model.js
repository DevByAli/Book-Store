import mongoose from "mongoose";

const NoOrderUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Provide User Id"],
  },
  email: {
    type: String,
    required: [true, "Provide user email"],
  },
});

export default mongoose.model("NoOrderUsers", NoOrderUserSchema);
