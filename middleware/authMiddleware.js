import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided. Please authenticate." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }
    
    req.user = { 
      id: user._id.toString(), 
      role: user.role, 
      email: user.email,
      username: user.username
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token. Please login again." });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired. Please login again." });
    }
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: "Authentication failed." });
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
