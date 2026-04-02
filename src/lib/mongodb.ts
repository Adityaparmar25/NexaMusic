
// ═══════════════════════════════════════════
//  lib/mongodb.ts  — Mongoose singleton
// ═══════════════════════════════════════════
import mongoose from "mongoose";

const URI = process.env.MONGODB_URI as string;
if (!URI) throw new Error("MONGODB_URI env variable is not set.");

interface Cached { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; }
// @ts-expect-error global caching
const cached: Cached = global.__mongoose ?? { conn: null, promise: null };
// @ts-expect-error global caching
if (!global.__mongoose) global.__mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(URI, {
      bufferCommands: false,
      dbName: "nexamusic",
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}