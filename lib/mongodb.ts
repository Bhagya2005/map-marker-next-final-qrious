import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/map-marker";

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    console.log("✓ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(" Connecting to MongoDB:", MONGO_URI);
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then((mongoose) => {
        console.log(" MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error(" MongoDB connection failed:", error.message);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}
