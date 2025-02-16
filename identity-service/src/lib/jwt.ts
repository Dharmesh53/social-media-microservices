import jwt from "jsonwebtoken"
import { privateKey, publicKey } from "./key-pairs"
import { randomBytes } from "node:crypto"
import RefreshToken from "@/models/refresh-token"
import { logger } from "@/loaders/logger"
import { IUser } from "@/interfaces/IUser"
import { HttpStatusCode } from "@/config"
import { AppError } from "@/errors/app-error"

export const generateTokens = async (user: IUser) => {
  try {
    logger.debug("Creating access token for %o", user)
    const accessToken = jwt.sign({
      sub: user._id,
      username: user.username
    }, privateKey, { algorithm: "RS256", expiresIn: "10m" })

    const refreshToken = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 3)

    logger.debug("Creating refresh token for %o", user)
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt
    })

    return { accessToken, refreshToken }
  } catch (error) {
    throw (new AppError(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      `TokenGenerationError, ${error.name}`,
      `Failed to generate token, ${error.message}}`
    ))
  }
}

export const verifyToken = (token: string) => {
  try {
    if (!token) return false;
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] })
  } catch (error) {
    logger.error(error.message)
    return false
  }
}
