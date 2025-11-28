import DietFilter from "../models/dietFilter.js";

export const createDietFilter = async (req, res) => {
  try {
    const { name } = req.body;
    
    const filter = await DietFilter.create({ name });
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
    const filters = await DietFilter.find().sort({ name: 1 });
    res.json(filters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDietFilterById = async (req, res) => {
  try {
    const filter = await DietFilter.findById(req.params.id);
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
    
    const filter = await DietFilter.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    
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
    const filter = await DietFilter.findByIdAndDelete(req.params.id);
    
    if (!filter) {
      return res.status(404).json({ message: "Diet filter not found" });
    }
    
    res.json({ message: "Diet filter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
