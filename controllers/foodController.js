import * as foodRepository from "../repositories/foodRepository.js";
import * as storeRepository from "../repositories/storeRepository.js";
import * as reviewRepository from "../repositories/reviewRepository.js";
import mongoose from "mongoose";

export const createFood = async (req, res) => {
  try {
    const { categoryId, name, description, price, isAvailable, images, filters } = req.body;
    
    const store = await storeRepository.findStoreByUserId(req.user.id);
    if (!store) {
      return res.status(403).json({ message: "You must have a store to add food items" });
    }

    const food = await foodRepository.createFood({
      storeId: store._id,
      categoryId,
      name,
      description,
      price,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      images: images || [],
      filters: filters || []
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllFoods = async (req, res) => {
  try {
    const { categoryId, storeId, minPrice, maxPrice, isAvailable, filters, search } = req.query;
    
    let query = {};
    
    if (categoryId) query.categoryId = categoryId;
    if (storeId) query.storeId = storeId;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (filters) {
      const filterIds = filters.split(',');
      query.filters = { $in: filterIds };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const foods = await foodRepository.findAllFoods(query);
    
    const foodIds = foods.map(food => new mongoose.Types.ObjectId(food._id));
    const reviewStats = await reviewRepository.getReviewStatsByFoodIds(foodIds);
    
    const foodsWithReviews = foods.map(food => {
      const stats = reviewStats[food._id.toString()] || { averageRating: 0, totalReviews: 0 };
      return {
        ...food.toObject(),
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews
      };
    });
    
    res.json(foodsWithReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await foodRepository.findFoodById(req.params.id);
      
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    
    const foodIds = [new mongoose.Types.ObjectId(food._id)];
    const reviewStats = await reviewRepository.getReviewStatsByFoodIds(foodIds);
    const stats = reviewStats[food._id.toString()] || { averageRating: 0, totalReviews: 0 };
    
    const foodWithReviews = {
      ...food.toObject(),
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews
    };
    
    res.json(foodWithReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyFoods = async (req, res) => {
  try {
    const store = await storeRepository.findStoreByUserId(req.user.id);
    if (!store) {
      return res.status(404).json({ message: "You don't have a store" });
    }

    const foods = await foodRepository.findFoodsByStoreId(store._id);
    
    const foodIds = foods.map(food => new mongoose.Types.ObjectId(food._id));
    const reviewStats = await reviewRepository.getReviewStatsByFoodIds(foodIds);
    
    const foodsWithReviews = foods.map(food => {
      const stats = reviewStats[food._id.toString()] || { averageRating: 0, totalReviews: 0 };
      return {
        ...food.toObject(),
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews
      };
    });
    
    res.json(foodsWithReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { categoryId, name, description, price, isAvailable, images, filters } = req.body;
    
    const food = await foodRepository.findFoodById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const store = await storeRepository.findStoreByUserId(req.user.id);
    if (!store || store._id.toString() !== food.storeId._id.toString()) {
      return res.status(403).json({ message: "You don't have permission to update this food" });
    }

    const updateData = {};
    if (categoryId) updateData.categoryId = categoryId;
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = price;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (images) updateData.images = images;
    if (filters) updateData.filters = filters;

    const updatedFood = await foodRepository.updateFood(req.params.id, updateData);
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await foodRepository.findFoodById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const store = await storeRepository.findStoreByUserId(req.user.id);
    if (!store || store._id.toString() !== food.storeId._id.toString()) {
      return res.status(403).json({ message: "You don't have permission to delete this food" });
    }

    await foodRepository.deleteFood(req.params.id);
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
