import { HttpStatusCode } from "@/config"

export class AppError extends Error {
  public readonly name: string
  public readonly statusCode: HttpStatusCode
  public readonly details: Record<string, unknown>[]

  constructor(statusCode: HttpStatusCode, name: string, message: string, details?: Record<string, unknown>[]) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype) // ???, Go see the MDN Docs

    this.name = name;
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor)
  }
}

