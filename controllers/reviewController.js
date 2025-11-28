import Review from "../models/review.js";
import Order from "../models/order.js";
import Food from "../models/food.js";

// Create review (customer only, must have ordered the food)
export const createReview = async (req, res) => {
  try {
    const { orderId, foodId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only review your own orders" });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ message: "You can only review completed orders" });
    }

    const orderItem = order.items.find(item => item.foodId.toString() === foodId);
    if (!orderItem) {
      return res.status(400).json({ message: "This food was not in your order" });
    }

    const existingReview = await Review.findOne({ orderId, foodId, customerId: req.user.id });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this food for this order" });
    }

    const review = await Review.create({
      orderId,
      foodId,
      customerId: req.user.id,
      rating,
      comment
    });

    await review.populate(['foodId', 'customerId', 'orderId']);
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

    let reviews = await Review.find(query)
      .populate('foodId')
      .populate('customerId', 'username')
      .populate('orderId')
      .sort({ createdAt: -1 });

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
    
    const reviews = await Review.find({ foodId })
      .populate('customerId', 'username')
      .populate('orderId')
      .sort({ createdAt: -1 });

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
    const review = await Review.findById(req.params.id)
      .populate('foodId')
      .populate('customerId', 'username')
      .populate('orderId');
      
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
    const reviews = await Review.find({ customerId: req.user.id })
      .populate('foodId')
      .populate('orderId')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own reviews" });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }
    
    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();
    await review.populate(['foodId', 'customerId', 'orderId']);
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
