import { Router } from "express"
import { registerUser } from "../controllers/auth.controller"
import { validateRegistration } from "../middlewares/auth.middleware"

export default (router: Router) => {
  router.post('/signup', validateRegistration(), registerUser)
}
