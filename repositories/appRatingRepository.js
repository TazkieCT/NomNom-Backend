import AppRating from "../models/appRating.js";

export const createAppRating = async (ratingData) => {
  return await AppRating.create(ratingData);
};

export const findAppRatingByCustomerId = async (customerId) => {
  return await AppRating.findOne({ customerId }).populate("customerId", "username email");
};

export const updateAppRatingByCustomerId = async (customerId, updateData) => {
  return await AppRating.findOneAndUpdate(
    { customerId },
    updateData,
    { new: true, runValidators: true }
  ).populate("customerId", "username email");
};

export const deleteAppRatingByCustomerId = async (customerId) => {
  return await AppRating.findOneAndDelete({ customerId });
};

export const findAllAppRatings = async (filter = {}) => {
  return await AppRating.find(filter)
    .populate("customerId", "username email")
    .sort({ createdAt: -1 });
};

export const findApprovedAppRatings = async () => {
  return await AppRating.find({ isApproved: true })
    .populate("customerId", "username email")
    .sort({ createdAt: -1 });
};

export const getAverageRating = async () => {
  const result = await AppRating.aggregate([
    { $match: { isApproved: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0 ? result[0] : { averageRating: 0, totalRatings: 0 };
};

export const updateAppRatingApproval = async (ratingId, isApproved) => {
  return await AppRating.findByIdAndUpdate(
    ratingId,
    { isApproved },
    { new: true }
  ).populate("customerId", "username email");
};
