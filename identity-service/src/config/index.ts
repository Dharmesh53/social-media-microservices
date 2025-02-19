import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

const getenv = (key: string, defaultValue: string = '') => {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error('Cannot find the key named: ${key} or the defaultValue not provided');
  }
  return value;
};

export const config = {
  port: parseInt(getenv('PORT'), 10),
  databaseUrl: getenv('MONGODB_URI'),
  redisUrl: getenv('REDIS_URL'),
  origins: getenv('ORIGINS').split(','),
  nodeEnv: getenv('NODE_ENV', 'development'),
  jwt: {
    secret: getenv('JWT_SECRET'),
    algorithm: getenv('JWT_ALGO'),
  },
  logs: {
    level: getenv('LOG_LEVEL', 'silly'),
  },
  api: {
    v1Prefix: '/api/v1',
  },
};

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export enum CommanErrorsDict {
  routeNotFound = 'Route not found',
  resourceNotFound = 'Resource not found',
  notAllowed = "Sorry bud, you are not allowed !!",
  tooManyRequests = 'Too many Requests, Please try again later.',
  unexpectedError = "An unexpected error occurred",
}

export enum Env {
  DEV = 'development',
  PROD = 'production'
}
