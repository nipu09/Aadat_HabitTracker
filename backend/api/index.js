// Vercel serverless entry. vercel.json routes every path here.
const connectDB = require("../config/db");
const app = require("../app");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    return res.status(503).json({ success: false, message: "Service temporarily unavailable.", code: "DB_DOWN" });
  }
  return app(req, res);
};
