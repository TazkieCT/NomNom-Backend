import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  maxDiscountAmount: { type: Number },
  expiresAt: { type: Date, required: true },
  usageLimit: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  minimumOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
