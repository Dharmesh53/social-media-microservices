import { config, HttpStatusCode } from "@/config"
import express from "express"
import v1Routes from "@/api"
import { ErrorHandler } from "@/errors/error-handler"
import { morganMiddleware } from "./logger"
import helmet from "helmet"
import "@/errors"

export default async function expressLoader({ app }: { app: express.Application }) {
  app.head('/status', (_, res) => { res.status(HttpStatusCode.OK).end() })

  app.use(helmet())

  app.use(morganMiddleware)

  app.use(express.json())

  app.use(config.api.v1Prefix, v1Routes())

  app.use(ErrorHandler.throw404)

  app.use(ErrorHandler.handle())
}
