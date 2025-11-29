import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true },
  priceEach: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  finalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'cancelled', 'completed'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
