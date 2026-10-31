// Long-running server entry (local development, Docker, VPS).
// On Vercel the app is served by api/index.js instead.
const env = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

async function start() {
  await connectDB();
  const server = app.listen(env.PORT, () => console.log(`Aadat API listening on :${env.PORT} (${env.NODE_ENV})`));

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down...`);
    server.close(() => require("mongoose").connection.close().finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
