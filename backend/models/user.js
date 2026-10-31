const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    password: { type: String, required: true, select: false },
    isVerified: { type: Boolean, default: false },

    // Email verification code (stored as an HMAC, never in plain text)
    otpHash: { type: String, select: false },
    otpExpires: Date,
    otpAttempts: { type: Number, default: 0 },
    otpSentAt: Date,

    // Password reset code
    resetHash: { type: String, select: false },
    resetExpires: Date,
    resetAttempts: { type: Number, default: 0 },
    resetSentAt: Date,

    // Incremented on password change/reset to invalidate older sessions
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
