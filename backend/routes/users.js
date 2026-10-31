const express = require("express");

const router = express.Router();

const userModel = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
