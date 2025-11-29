import * as userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validate role
    if (role && !['customer', 'seller'].includes(role)) {
      return res.status(400).json({ error: "Role must be either 'customer' or 'seller'" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({ 
      username, 
      email, 
      password: hashedPassword,
      role: role || 'customer'
    });
    
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.json({ message: "User registered!", user: userResponse });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "User not found!" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(401).json({ error: "Wrong password!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ 
      message: "Login successful!", 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Apply to become a seller
export const applyToBecomeSeller = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already a seller
    if (user.role === 'seller') {
      return res.status(400).json({ error: "You are already a seller" });
    }

    // Update role to seller
    const updatedUser = await userRepository.updateUserRole(req.user.id, 'seller');

    res.json({ 
      message: "Successfully upgraded to seller account!",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

