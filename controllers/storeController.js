import * as storeRepository from "../repositories/storeRepository.js";

export const createStore = async (req, res) => {
  try {
    const { name, address, latitude, longitude, openHours } = req.body;
    
    const existingStore = await storeRepository.findStoreByUserId(req.user.id);
    if (existingStore) {
      return res.status(400).json({ message: "You already have a store" });
    }

    const store = await storeRepository.createStore({
      userId: req.user.id,
      name,
      address,
      latitude,
      longitude,
      openHours
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;
    
    let stores;
    if (latitude && longitude && radius) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const rad = parseFloat(radius);
      
      stores = await storeRepository.findStoresWithLocation();
      
      stores = stores.filter(store => {
        const distance = calculateDistance(lat, lon, store.latitude, store.longitude);
        return distance <= rad;
      });
    } else {
      stores = await storeRepository.findAllStores();
    }
    
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStoreById = async (req, res) => {
  try {
    const store = await storeRepository.findStoreById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyStore = async (req, res) => {
  try {
    const store = await storeRepository.findStoreByUserId(req.user.id);
    if (!store) {
      return res.status(404).json({ message: "You don't have a store yet" });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStore = async (req, res) => {
  try {
    const { name, address, latitude, longitude, openHours } = req.body;
    
    const store = await storeRepository.findStoreByUserId(req.user.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (openHours) updateData.openHours = openHours;

    const updatedStore = await storeRepository.updateStore(store._id, updateData);
    res.json(updatedStore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStore = async (req, res) => {
  try {
    const store = await storeRepository.findStoreByUserId(req.user.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await storeRepository.deleteStore(store._id);
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
