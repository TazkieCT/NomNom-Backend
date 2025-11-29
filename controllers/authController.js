import * as userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Username validation (alphanumeric, 3-20 characters)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        error: "Username must be 3-20 characters long and contain only letters, numbers, and underscores" 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Check password complexity (at least one letter and one number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: "Password must contain at least one letter and one number" 
      });
    }
    
    // Validate role
    if (role && !['customer', 'seller'].includes(role)) {
      return res.status(400).json({ error: "Role must be either 'customer' or 'seller'" });
    }

    // Check if user already exists (prevent timing attacks by checking both)
    const existingUser = await userRepository.findUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password with higher cost factor for better security
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userRepository.createUser({ 
      username: username.trim(), 
      email: email.toLowerCase().trim(), 
      password: hashedPassword,
      role: role || 'customer'
    });
    
    // Generate JWT token for automatic login after registration
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );
    
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(201).json({ 
      message: "User registered successfully!", 
      user: userResponse,
      token 
    });
  } catch (error) {
    if (error.code === 11000) {
      // Determine which field caused the duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user and include password for comparison
    const user = await userRepository.findUserByEmailWithPassword(normalizedEmail);
    
    // Use generic error message to prevent user enumeration attacks
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token with user role for authorization
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Return success response without password
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
    console.error('Login error:', error);
    res.status(500).json({ error: "Login failed. Please try again." });
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

