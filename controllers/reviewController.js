import * as reviewRepository from "../repositories/reviewRepository.js";
import * as orderRepository from "../repositories/orderRepository.js";

// Create review (customer only, must have ordered the food)
export const createReview = async (req, res) => {
  try {
    const { orderId, foodId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const order = await orderRepository.findOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only review your own orders" });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ message: "You can only review completed orders" });
    }

    const orderItem = order.items.find(item => item.foodId._id.toString() === foodId);
    if (!orderItem) {
      return res.status(400).json({ message: "This food was not in your order" });
    }

    const existingReview = await reviewRepository.findExistingReview(orderId, foodId, req.user.id);
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this food for this order" });
    }

    const review = await reviewRepository.createReview({
      orderId,
      foodId,
      customerId: req.user.id,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { foodId, storeId, customerId, minRating, maxRating } = req.query;
    
    let query = {};
    
    if (foodId) query.foodId = foodId;
    if (customerId) query.customerId = customerId;
    
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = parseInt(minRating);
      if (maxRating) query.rating.$lte = parseInt(maxRating);
    }

    let reviews = await reviewRepository.findAllReviews(query);

    if (storeId) {
      reviews = reviews.filter(review => 
        review.foodId && review.foodId.storeId && 
        review.foodId.storeId.toString() === storeId
      );
    }
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoodReviews = async (req, res) => {
  try {
    const { foodId } = req.params;
    
    const reviews = await reviewRepository.findReviewsByFoodId(foodId);

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      averageRating: avgRating.toFixed(1),
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await reviewRepository.findReviewById(req.params.id);
      
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await reviewRepository.findReviewsByCustomerId(req.user.id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await reviewRepository.findReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own reviews" });
    }

    const updateData = {};
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      updateData.rating = rating;
    }
    
    if (comment !== undefined) {
      updateData.comment = comment;
    }

    const updatedReview = await reviewRepository.updateReview(req.params.id, updateData);
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await reviewRepository.findReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    await reviewRepository.deleteReview(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
