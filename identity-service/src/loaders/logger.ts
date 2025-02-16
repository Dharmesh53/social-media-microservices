import winston from 'winston';
import morgan from "morgan"
import { config } from '@/config';
import DailyRotateFile from 'winston-daily-rotate-file';

const createTransports = () => {
  if (process.env.NODE_ENV !== "development") {
    return [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.splat(),
          winston.format.json(),
        )
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.splat(),
          winston.format.json(),
        )
      }),
      createInfoFileTransport()
    ];
  } else {
    return [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.cli(),
          winston.format.splat(),
          winston.format.timestamp({ format: 'hh:mm:ss.SSS A' }),
          winston.format.errors({ stack: true }),
          winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
          winston.format.align(),
          winston.format.colorize({ all: true }),
        ),
      })
    ]
  }
}

const createInfoFileTransport = () => {
  return new DailyRotateFile({
    filename: "logs/app-%DATE%.log",
    datePattern: 'DD-MM',
    zippedArchive: false,
    maxSize: '5m',
    maxFiles: '4d',
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.splat(),
    )
  })
}

const logger = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  defaultMeta: { service: "identity-service" },
  transports: createTransports(),
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

const morganStream = {
  write: (message: string) => {
    logger.info(message.trim())
  }
}

const skip = () => process.env.NODE_ENV !== "development"

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream: morganStream, skip }
)

export { logger, morganMiddleware };
