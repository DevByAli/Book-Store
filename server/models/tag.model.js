import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: [true, "Please provide tag."],
  },
});

export default mongoose.model('Tags', TagSchema)
