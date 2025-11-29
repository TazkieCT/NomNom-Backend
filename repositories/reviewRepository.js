import Review from "../models/review.js";

export const createReview = async (reviewData) => {
  const review = await Review.create(reviewData);
  return await review.populate(['foodId', 'customerId', 'orderId']);
};

export const findAllReviews = async (query) => {
  return await Review.find(query)
    .populate('foodId')
    .populate('customerId', 'username')
    .populate('orderId')
    .sort({ createdAt: -1 });
};

export const findReviewsByFoodId = async (foodId) => {
  return await Review.find({ foodId })
    .populate('customerId', 'username')
    .populate('orderId')
    .sort({ createdAt: -1 });
};

export const findReviewsByCustomerId = async (customerId) => {
  return await Review.find({ customerId })
    .populate('foodId')
    .populate('orderId')
    .sort({ createdAt: -1 });
};

export const findReviewById = async (id) => {
  return await Review.findById(id)
    .populate('foodId')
    .populate('customerId', 'username')
    .populate('orderId');
};

export const findExistingReview = async (orderId, foodId, customerId) => {
  return await Review.findOne({ orderId, foodId, customerId });
};

export const updateReview = async (id, reviewData) => {
  const review = await Review.findByIdAndUpdate(id, reviewData, { new: true, runValidators: true });
  if (review) {
    await review.populate(['foodId', 'customerId', 'orderId']);
  }
  return review;
};

export const deleteReview = async (id) => {
  return await Review.findByIdAndDelete(id);
};
