import mongoose from "mongoose";
import { ENV } from "../lib/env.js";

export async function connectToDatabase(): Promise<void> {
  console.log(
    `Connecting to ${ENV.MONGO_DB_NAME} at ${ENV.MONGO_DB_CONNECTION_STRING}`
  );
  await mongoose.connect(ENV.MONGO_DB_CONNECTION_STRING, {
    dbName: ENV.MONGO_DB_NAME,
  });

  console.log("✅ Connected to MongoDB");
}
