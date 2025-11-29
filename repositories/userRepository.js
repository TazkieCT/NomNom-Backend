import User from "../models/user.js";

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (id) => {
  return await User.findById(id).select('-password');
};

export const updateUserRole = async (id, role) => {
  return await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );
};
