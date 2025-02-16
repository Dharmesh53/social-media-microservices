import { HttpStatusCode } from "@/config"
import { AppError } from "@/errors/app-error"
import { IUserInputDTO } from "@/interfaces/IUser"
import { logger } from "@/loaders/logger"
import User from "@/models/user"
import { convertToAppError } from "@/utils"
import { generateTokens } from "@/utils/jwt"

export default class AuthService {
  public async SignUp(userInputDTO: IUserInputDTO) {
    try {
      const { username, email, password } = userInputDTO

      logger.debug("Checking if user already exists")
      const existingUser = await User.findOne({ $or: [{ email }, { username }] })
      if (existingUser) {
        throw new AppError(HttpStatusCode.BAD_REQUEST, "SignUpError", 'User already exists')
      }

      logger.debug("Creating User...")
      const userRecord = await User.create({ username, email, password })
      logger.debug("User with id %s created successfully", userRecord._id)

      const user = userRecord.toObject()
      delete user.password

      // welcome mail

      logger.debug("Generating tokens...")
      const { accessToken, refreshToken } = await generateTokens(userRecord)

      return { user, accessToken, refreshToken }
    } catch (error) {
      logger.error('Sign up error, %s', error.message)
      throw convertToAppError(error, "SignUpError")
    }
  }
}
