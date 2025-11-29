import Food from "../models/food.js";

export const createFood = async (foodData) => {
  const food = await Food.create(foodData);
  return await food.populate(['categoryId', 'storeId', 'filters']);
};

export const findAllFoods = async (query) => {
  return await Food.find(query)
    .populate('categoryId')
    .populate('storeId')
    .populate('filters')
    .sort({ createdAt: -1 });
};

export const findFoodById = async (id) => {
  return await Food.findById(id)
    .populate('categoryId')
    .populate('storeId')
    .populate('filters');
};

export const findFoodsByStoreId = async (storeId) => {
  return await Food.find({ storeId })
    .populate('categoryId')
    .populate('filters')
    .sort({ createdAt: -1 });
};

export const updateFood = async (id, foodData) => {
  const food = await Food.findByIdAndUpdate(id, foodData, { new: true, runValidators: true });
  if (food) {
    await food.populate(['categoryId', 'storeId', 'filters']);
  }
  return food;
};

export const deleteFood = async (id) => {
  return await Food.findByIdAndDelete(id);
};
