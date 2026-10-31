const jwt = require("jsonwebtoken");
const env = require("../config/env");

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// tv = token version, bumped on password change/reset to sign out every other session
const generateToken = (user) =>
  jwt.sign({ userId: user._id.toString(), tv: user.tokenVersion || 0 }, env.JWT_KEY, {
    expiresIn: "7d",
  });

const cookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.COOKIE_SAMESITE,
  path: "/",
});

const setAuthCookie = (res, user) =>
  res.cookie("token", generateToken(user), { ...cookieOptions(), maxAge: SEVEN_DAYS_MS });

const clearAuthCookie = (res) => res.clearCookie("token", cookieOptions());

module.exports = { generateToken, setAuthCookie, clearAuthCookie };
