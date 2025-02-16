import { CommanErrorsDict, HttpStatusCode } from "@/config";
import { logger } from "@/loaders/logger";
import { NextFunction, Response, Request } from "express";
import { AppError } from "./app-error";
import mongoose from "mongoose";
import { ZodError } from "zod";

export class ErrorHandler {
  static handle(options = { showStack: true }) {
    return (err: Error, req: Request, res: Response, _: NextFunction) => {
      let error: AppError;

      if (err instanceof ZodError) {
        error = new AppError(
          HttpStatusCode.BAD_REQUEST,
          "ValidationError",
          "Invalid input data",
          [err.flatten()]
        );
      }
      else if (err instanceof mongoose.Error) {
        error = new AppError(
          HttpStatusCode.BAD_REQUEST,
          `MongoDbError, ${err.name}`,
          err.message
        );
      }
      else if (err instanceof AppError) {
        error = err;
      }
      else {
        error = new AppError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          err.name || "InternalServerError",
          err.message || CommanErrorsDict.unexpectedError
        );
      }

      if (options.showStack) {
        if (error.statusCode < 500) {
          logger.warn(error.stack);
        } else {
          logger.error(error.stack);
        }
      } else {
        if (error.statusCode < 500) {
          logger.warn(`${error.name}: ${error.message}`);
        } else {
          logger.error(`${error.name}: ${error.message}`);
        }
      }

      const response: Record<string, unknown> = {
        success: false,
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
        ...(error.details?.length > 0 && { details: error.details }),
        ...(options.showStack && { stack: error.stack }),
      };

      res.status(error.statusCode).json(response);
    };
  }

  static throw404(_: Request, __: Response, next: NextFunction) {
    next(new AppError(HttpStatusCode.NOT_FOUND, "Not Found", CommanErrorsDict.routeNotFound));
  }
}
