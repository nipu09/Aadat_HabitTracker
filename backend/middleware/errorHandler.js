const { ZodError } = require("zod");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const notFound = (req, res, next) => next(new AppError(404, "Route not found.", "NOT_FOUND"));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    const errors = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "form";
      if (!errors[key]) errors[key] = issue.message;
    }
    return res.status(400).json({
      success: false,
      message: err.issues[0]?.message || "Invalid input.",
      code: "VALIDATION_ERROR",
      errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({ success: false, message: err.message, code: err.code, ...err.extra });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID.", code: "BAD_ID" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "That record already exists.", code: "DUPLICATE" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body too large.", code: "TOO_LARGE" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Malformed JSON body.", code: "BAD_JSON" });
  }

  console.error(`[error] ${req.method} ${req.originalUrl}`, env.NODE_ENV === "production" ? err.message : err);
  return res.status(500).json({ success: false, message: "Something went wrong on our side.", code: "INTERNAL" });
};

module.exports = { notFound, errorHandler };
