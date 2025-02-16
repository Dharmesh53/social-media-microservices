import { AppError } from "@/errors/app-error"
import { CommanErrorsDict, config, HttpStatusCode } from "."

export const corsConfig = {
  origin: (origin: string, callback: (error: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [...config.origins]

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new AppError(HttpStatusCode.FORBIDDEN, 'Not allowed', CommanErrorsDict.notAllowed))
    }
  },
  credentials: true,
  preflightContinue: false,
  maxAge: 600,
}
