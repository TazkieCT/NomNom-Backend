import mongoose from "mongoose";

export const health = (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: states[dbState] || "unknown",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
