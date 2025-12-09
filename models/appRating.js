import mongoose from "mongoose";

const appRatingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // Can be any user (customer or seller)
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one rating per user
appRatingSchema.index({ customerId: 1 }, { unique: true });

const AppRating = mongoose.model("AppRating", appRatingSchema);

export default AppRating;
