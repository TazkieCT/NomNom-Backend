import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  images: [{ type: String }], // Array of image URLs
  filters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DietFilter' }] // Many-to-many
}, { timestamps: true });

export default mongoose.model("Food", foodSchema);
