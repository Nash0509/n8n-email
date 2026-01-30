import mongoose from "mongoose";

const MONGODB_URI = `mongodb+srv://nishant:nishant%40123@cluster0.2i440og.mongodb.net/emails?retryWrites=true&w=majority
`;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    isConnected: false,
  };
}

export async function connectDB() {
  if (cached.conn) {
    console.log("🟢 MongoDB already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🟡 Connecting to MongoDB...");

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        cached.isConnected = true;
        console.log("🟢 MongoDB connection established");
        return mongoose;
      })
      .catch((err) => {
        cached.isConnected = false;
        console.error("🔴 MongoDB connection failed:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// helper to check status
export function getDBStatus() {
  return cached.isConnected;
}
