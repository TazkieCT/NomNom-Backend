import DietFilter from "../models/dietFilter.js";

export const createDietFilter = async (filterData) => {
  return await DietFilter.create(filterData);
};

export const findAllDietFilters = async () => {
  return await DietFilter.find().sort({ name: 1 });
};

export const findDietFilterById = async (id) => {
  return await DietFilter.findById(id);
};

export const updateDietFilter = async (id, filterData) => {
  return await DietFilter.findByIdAndUpdate(
    id,
    filterData,
    { new: true, runValidators: true }
  );
};

export const deleteDietFilter = async (id) => {
  return await DietFilter.findByIdAndDelete(id);
};
