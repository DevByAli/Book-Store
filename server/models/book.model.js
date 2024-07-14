import mongoose from "mongoose";

const errorMsg = (word) => `Please provide the book ${word}.`;

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, errorMsg("title")],
      unique: true,
      trim: true,
    },
    author: {
      type: String,
      required: [true, errorMsg("author")],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, errorMsg("price")],
    },
    description: {
      type: String,
      required: [true, errorMsg("description")],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, errorMsg("tags")],
      validate: {
        validator: (v) => {
          return v && v.length > 0 && v.every((tag) => typeof tag === "string");
        },
        message:
          "Tags must be an array of strings and contain at least one tag.",
      },
    },
    purchased: {
      type: Number,
      default: 0,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    url: {
      type: String,
      required: [true, errorMsg("Cover Photo")],
    },
    cloudinaryId: {
      type: String,
      required: [true, errorMsg("cloudinary id")],
    },
  },
  {
    timestamps: true,
  }
);

// Add index to the 'title' field for faster searches
BookSchema.index({ title: "text", author: "text" });

export default mongoose.model("Book", BookSchema);
