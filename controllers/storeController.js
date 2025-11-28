import Store from "../models/store.js";

export const createStore = async (req, res) => {
  try {
    const { name, address, latitude, longitude, openHours } = req.body;
    
    const existingStore = await Store.findOne({ userId: req.user.id });
    if (existingStore) {
      return res.status(400).json({ message: "You already have a store" });
    }

    const store = await Store.create({
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
      
      stores = await Store.find({
        latitude: { $exists: true },
        longitude: { $exists: true }
      }).populate('userId', 'username email');
      
      stores = stores.filter(store => {
        const distance = calculateDistance(lat, lon, store.latitude, store.longitude);
        return distance <= rad;
      });
    } else {
      stores = await Store.find().populate('userId', 'username email');
    }
    
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('userId', 'username email');
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
    const store = await Store.findOne({ userId: req.user.id }).populate('userId', 'username email');
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
    
    const store = await Store.findOne({ userId: req.user.id });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    store.name = name || store.name;
    store.address = address || store.address;
    store.latitude = latitude !== undefined ? latitude : store.latitude;
    store.longitude = longitude !== undefined ? longitude : store.longitude;
    store.openHours = openHours || store.openHours;

    await store.save();
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findOne({ userId: req.user.id });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await store.deleteOne();
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
