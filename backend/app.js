const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

const env = require("./config/env");
const originGuard = require("./middleware/originGuard");
const { globalLimiter } = require("./middleware/rateLimit");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", env.TRUST_PROXY);
app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin(origin, cb) {
      // No Origin header = non-browser client (health checks, curl) or same-origin
      if (!origin || env.allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(compression());
if (env.NODE_ENV !== "test") app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(originGuard);
app.use(globalLimiter);

app.get("/", (req, res) => res.json({ name: "aadat-api", status: "ok" }));
app.get("/health", (req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({ status: dbUp ? "ok" : "degraded", db: dbUp ? "up" : "down" });
});

app.use("/auth", require("./routes/auth"));
app.use("/habits", require("./routes/habits"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
