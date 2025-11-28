import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: "User not found!" });
    }
    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token!" });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ error: "Access denied. Seller role required." });
  }
  next();
};

export const isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: "Access denied. Customer role required." });
  }
  next();
};
