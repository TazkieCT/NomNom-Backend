import * as storeRepository from "../repositories/storeRepository.js";

export const createStore = async (req, res) => {
  try {
    const { name, address, mapsLink, openHours } = req.body;
    
    const existingStore = await storeRepository.findStoreByUserId(req.user.id);
    if (existingStore) {
      return res.status(400).json({ message: "You already have a store" });
    }

    const store = await storeRepository.createStore({
      userId: req.user.id,
      name,
      address,
      mapsLink,
      openHours
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.findAllStores();
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
    const { name, address, mapsLink, openHours } = req.body;
    
    const store = await storeRepository.findStoreByUserId(req.user.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (mapsLink !== undefined) updateData.mapsLink = mapsLink;
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
