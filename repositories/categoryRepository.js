import Category from "../models/category.js";

export const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

export const findAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

export const findCategoryById = async (id) => {
  return await Category.findById(id);
};

export const updateCategory = async (id, categoryData) => {
  return await Category.findByIdAndUpdate(
    id,
    categoryData,
    { new: true, runValidators: true }
  );
};

export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};
