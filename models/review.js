import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

// Ensure one review per food per order
reviewSchema.index({ orderId: 1, foodId: 1, customerId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
