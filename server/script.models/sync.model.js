import mongoose from "mongoose";

const syncItemSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  quantity: { type: Number, required: true, default: 0 },
});

const syncSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [syncItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Sync", syncSchema);
