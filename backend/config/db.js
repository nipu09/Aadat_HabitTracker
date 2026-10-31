const mongoose = require("mongoose");
const env = require("./env");

// Reuse one connection across warm serverless invocations (Vercel) and normal servers.
const cache = global.__aadatMongoose || (global.__aadatMongoose = { conn: null, promise: null });

mongoose.set("strictQuery", true);

async function connectDB() {
  if (cache.conn && mongoose.connection.readyState === 1) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10,
        bufferCommands: false,
      })
      .then((m) => {
        console.log("MongoDB connected");
        return m;
      })
      .catch((err) => {
        cache.promise = null; // allow a retry on the next request
        throw err;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

module.exports = connectDB;
