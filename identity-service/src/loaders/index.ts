import databaseLoader from "./database";
import expressLoader from "./express";
import { logger } from "./logger";
import fs from 'fs'

export default async function loaders({ app }) {
  await databaseLoader()
  logger.info("# Database connected")

  const models = fs.readdirSync("./src/models")
  models.forEach(async (model) => {
    await import(`../models/${model}`)
  })
  logger.info("# Models synced")

  await expressLoader({ app })
  logger.info("# Configured express")
}
