import Food from "../models/food.js";
import Store from "../models/store.js";

export const createFood = async (req, res) => {
  try {
    const { categoryId, name, description, price, isAvailable, images, filters } = req.body;
    
    const store = await Store.findOne({ userId: req.user.id });
    if (!store) {
      return res.status(403).json({ message: "You must have a store to add food items" });
    }

    const food = await Food.create({
      storeId: store._id,
      categoryId,
      name,
      description,
      price,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      images: images || [],
      filters: filters || []
    });

    await food.populate(['categoryId', 'storeId', 'filters']);
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
    
    const foods = await Food.find(query)
      .populate('categoryId')
      .populate('storeId')
      .populate('filters')
      .sort({ createdAt: -1 });
    
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('categoryId')
      .populate('storeId')
      .populate('filters');
      
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyFoods = async (req, res) => {
  try {
    const store = await Store.findOne({ userId: req.user.id });
    if (!store) {
      return res.status(404).json({ message: "You don't have a store" });
    }

    const foods = await Food.find({ storeId: store._id })
      .populate('categoryId')
      .populate('filters')
      .sort({ createdAt: -1 });
    
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { categoryId, name, description, price, isAvailable, images, filters } = req.body;
    
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const store = await Store.findOne({ userId: req.user.id, _id: food.storeId });
    if (!store) {
      return res.status(403).json({ message: "You don't have permission to update this food" });
    }

    food.categoryId = categoryId || food.categoryId;
    food.name = name || food.name;
    food.description = description !== undefined ? description : food.description;
    food.price = price || food.price;
    food.isAvailable = isAvailable !== undefined ? isAvailable : food.isAvailable;
    food.images = images || food.images;
    food.filters = filters || food.filters;

    await food.save();
    await food.populate(['categoryId', 'storeId', 'filters']);
    
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const store = await Store.findOne({ userId: req.user.id, _id: food.storeId });
    if (!store) {
      return res.status(403).json({ message: "You don't have permission to delete this food" });
    }

    await food.deleteOne();
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
