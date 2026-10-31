const rateLimit = require("express-rate-limit");

const make = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, message, code: "RATE_LIMITED" },
  });

const MIN = 60 * 1000;

module.exports = {
  globalLimiter: make(15 * MIN, 600, "Too many requests. Please slow down."),
  authLimiter: make(15 * MIN, 30, "Too many attempts. Please try again in a few minutes."),
  codeLimiter: make(15 * MIN, 15, "Too many code requests. Please try again later."),
};
