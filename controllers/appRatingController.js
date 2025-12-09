import * as appRatingRepository from "../repositories/appRatingRepository.js";

// Create or update app rating (Any authenticated user)
export const createOrUpdateAppRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if user already has a rating
    const existingRating = await appRatingRepository.findAppRatingByCustomerId(userId);

    let appRating;
    if (existingRating) {
      // Update existing rating
      appRating = await appRatingRepository.updateAppRatingByCustomerId(userId, {
        rating,
        comment,
        isApproved: false, // Reset approval status on update
      });
    } else {
      // Create new rating
      appRating = await appRatingRepository.createAppRating({
        customerId: userId,
        rating,
        comment,
      });
    }

    res.status(existingRating ? 200 : 201).json(appRating);
  } catch (error) {
    console.error("Error creating/updating app rating:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's own rating
export const getMyAppRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const appRating = await appRatingRepository.findAppRatingByCustomerId(userId);

    if (!appRating) {
      return res.status(404).json({ message: "No rating found" });
    }

    res.json(appRating);
  } catch (error) {
    console.error("Error getting app rating:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user's own rating
export const deleteMyAppRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const appRating = await appRatingRepository.deleteAppRatingByCustomerId(userId);

    if (!appRating) {
      return res.status(404).json({ message: "No rating found" });
    }

    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting app rating:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all approved ratings (Public)
export const getApprovedAppRatings = async (req, res) => {
  try {
    const ratings = await appRatingRepository.findApprovedAppRatings();
    const stats = await appRatingRepository.getAverageRating();

    res.json({
      ratings,
      averageRating: stats.averageRating.toFixed(1),
      totalRatings: stats.totalRatings,
    });
  } catch (error) {
    console.error("Error getting approved ratings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all ratings (Admin/Seller - for moderation)
export const getAllAppRatings = async (req, res) => {
  try {
    const { approved } = req.query;
    
    const filter = {};
    if (approved !== undefined) {
      filter.isApproved = approved === "true";
    }

    const ratings = await appRatingRepository.findAllAppRatings(filter);
    const stats = await appRatingRepository.getAverageRating();

    res.json({
      ratings,
      averageRating: stats.averageRating.toFixed(1),
      totalRatings: stats.totalRatings,
    });
  } catch (error) {
    console.error("Error getting all ratings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve/reject rating (Admin/Seller only)
export const updateRatingApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ message: "isApproved must be a boolean" });
    }

    const appRating = await appRatingRepository.updateAppRatingApproval(id, isApproved);

    if (!appRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json(appRating);
  } catch (error) {
    console.error("Error updating rating approval:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
