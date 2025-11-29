import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  mapsLink: { type: String },
  openHours: { type: String }
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);
