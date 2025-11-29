import Store from "../models/store.js";

export const createStore = async (storeData) => {
  return await Store.create(storeData);
};

export const findAllStores = async (query = {}) => {
  return await Store.find(query).populate('userId', 'username email');
};

export const findStoreById = async (id) => {
  return await Store.findById(id).populate('userId', 'username email');
};

export const findStoreByUserId = async (userId) => {
  return await Store.findOne({ userId }).populate('userId', 'username email');
};

export const findStoresWithLocation = async () => {
  return await Store.find({
    latitude: { $exists: true },
    longitude: { $exists: true }
  }).populate('userId', 'username email');
};

export const updateStore = async (id, storeData) => {
  return await Store.findByIdAndUpdate(
    id,
    storeData,
    { new: true, runValidators: true }
  );
};

export const deleteStore = async (id) => {
  return await Store.findByIdAndDelete(id);
};
