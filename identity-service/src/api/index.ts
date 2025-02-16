import { Router } from "express"
import authRouter from "./routes/auth.routes";

export default function() {
  const router = Router();

  authRouter(router)

  return router
}
