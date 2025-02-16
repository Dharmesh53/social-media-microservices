import Redis from "ioredis"
import { RateLimiterRedis } from "rate-limiter-flexible"
import { CommanErrorsDict, config, HttpStatusCode } from "."
import { AppError } from "@/errors/app-error"
import { Response, NextFunction, Request } from "express"
import { logger } from "@/loaders/logger"

const redisClient = new Redis(config.redisUrl)

redisClient.on('error', (err) => {
  logger.error('Redis Connection error: %o', err)
  process.exit(1)
})

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  points: 10,
  duration: 1
})

const rateLimiter = (points?: number, duration?: number) => {
  return async (req: Request, __: Response, next: NextFunction) => {
    try {
      const key = `${req.ip}-${req.url}`
      await rateLimiterRedis.consume(key, points, { duration })
      next()
    } catch {
      next(new AppError(HttpStatusCode.TOO_MANY_REQUESTS, 'LimitExceeded', CommanErrorsDict.tooManyRequests))
    }
  }
}

export const globalRateLimiter = () => rateLimiter()
export const strictRateLimiter = () => rateLimiter(5)
