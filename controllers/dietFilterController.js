import * as dietFilterRepository from "../repositories/dietFilterRepository.js";

export const createDietFilter = async (req, res) => {
  try {
    const { name } = req.body;
    
    const filter = await dietFilterRepository.createDietFilter({ name });
    res.status(201).json(filter);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Diet filter already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAllDietFilters = async (req, res) => {
  try {
    const filters = await dietFilterRepository.findAllDietFilters();
    res.json(filters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDietFilterById = async (req, res) => {
  try {
    const filter = await dietFilterRepository.findDietFilterById(req.params.id);
    if (!filter) {
      return res.status(404).json({ message: "Diet filter not found" });
    }
    res.json(filter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDietFilter = async (req, res) => {
  try {
    const { name } = req.body;
    
    const filter = await dietFilterRepository.updateDietFilter(req.params.id, { name });
    
    if (!filter) {
      return res.status(404).json({ message: "Diet filter not found" });
    }
    
    res.json(filter);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Diet filter name already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteDietFilter = async (req, res) => {
  try {
    const filter = await dietFilterRepository.deleteDietFilter(req.params.id);
    
    if (!filter) {
      return res.status(404).json({ message: "Diet filter not found" });
    }
    
    res.json({ message: "Diet filter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
