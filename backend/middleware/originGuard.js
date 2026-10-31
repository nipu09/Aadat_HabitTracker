const env = require("../config/env");
const AppError = require("../utils/AppError");

// Cookie-authenticated APIs are open to CSRF. Browsers always send an Origin header on
// cross-site state-changing requests, so reject any that don't come from our frontend.
module.exports = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (origin && !env.allowedOrigins.includes(origin)) {
    return next(new AppError(403, "Request origin is not allowed.", "BAD_ORIGIN"));
  }
  next();
};
