import { config } from "@/config";
import mongoose from "mongoose";
import { logger } from "./logger";

export default async function databaseLoader() {
  try {
    const connectionInstance = await mongoose.connect(config.databaseUrl)
    return connectionInstance.connection
  } catch (error) {
    logger.error("Error while connecting to database", error)
    process.exit(1);
  }
}
