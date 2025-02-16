import { validate } from "."
import { z } from "zod"

export const validateRegistration = () => {
  return validate(z.object({
    username: z.string().min(3, { message: "Username must contain at least 3 character(s)" }).max(50, { message: "Username must not contain more than 50 character(s)" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must contain at least 6 character(s)" }),
  }))
}
