import express from "express"
import { logger } from "./loaders/logger"
import { config } from "./config"

const startServer = async () => {
  const app = express()

  const loaders = await import('./loaders')
  loaders.default({ app })

  app.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`)
  }).on("error", (err) => {
    logger.error(`Server failed to start, ${err}`)
    process.exit(1)
  })
}

startServer()
