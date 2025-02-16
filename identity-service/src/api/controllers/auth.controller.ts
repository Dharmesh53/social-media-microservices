import { HttpStatusCode } from "@/config";
import { logger } from "@/loaders/logger";
import AuthService from "@/services/auth.service";
import { AppResponse, catchEmAll } from "@/lib/utils";
import { Request, Response } from "express";

const authService = new AuthService()

export const registerUser = catchEmAll(async (req: Request, res: Response) => {
  logger.debug('Proceeding registration with %o', req.body)

  const { accessToken, refreshToken } = await authService.SignUp(req.body)

  const response = new AppResponse(HttpStatusCode.CREATED, { accessToken, refreshToken }, 'User Created Successfully')
  return res.status(HttpStatusCode.CREATED).json(response)
})

// user login

// refresh token

// logout
