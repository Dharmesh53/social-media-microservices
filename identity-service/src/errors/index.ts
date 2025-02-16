import { logger } from "@/loaders/logger"

process.on("uncaughtException", (error: Error) => {
  logger.error('Uncaught Exception: ', error.message)
  logger.error(error.stack)
  process.exit(1)
})

process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1)
})
