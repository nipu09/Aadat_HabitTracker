const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/user");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

module.exports = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new AppError(401, "Authentication required. Please log in.", "UNAUTHENTICATED");

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_KEY);
  } catch {
    throw new AppError(401, "Invalid or expired session. Please log in again.", "SESSION_EXPIRED");
  }

  const user = await User.findById(decoded.userId).select("_id name email createdAt tokenVersion isVerified");
  if (!user || !user.isVerified || (decoded.tv ?? 0) !== user.tokenVersion) {
    throw new AppError(401, "Invalid or expired session. Please log in again.", "SESSION_EXPIRED");
  }

  req.user = user;
  next();
});
