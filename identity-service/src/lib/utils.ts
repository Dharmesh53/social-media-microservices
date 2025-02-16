import { HttpStatusCode } from "@/config";
import { AppError } from "@/errors/app-error";
import { Request, Response, NextFunction } from "express";

export class AppResponse {
  public readonly statusCode: HttpStatusCode
  public readonly data: Record<string, unknown>
  public readonly message: string
  public readonly success: boolean

  constructor(statusCode: HttpStatusCode, data: Record<string, unknown>, message: string = "Success") {
    this.success = statusCode < 400
    this.statusCode = statusCode
    this.data = data
    this.message = message
  }
}

type RequestHandler = (req: Request, res: Response, next?: NextFunction) => unknown;

export function catchEmAll(requestHandler: RequestHandler) {
  return function(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
  }
}

export function convertToAppError(err: unknown, name: string) {
  return err instanceof AppError
    ? err
    : new AppError(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      name,
      err instanceof Error ? err.message : "Unknown error"
    )
}
