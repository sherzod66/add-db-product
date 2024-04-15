import { Router } from "express";
import { AuthController } from "../controllers";
import { validate } from "./../middlewares/validate";
import {
  signInValidationSchema,
  signUpValidationSchema,
  verifyOtpValidationSchema,
  refreshTokenValidationSchema,
  logOutValidationSchema,
} from "./../validation/schemas/auth";

const router = Router();

const controller = new AuthController();

router.post("/signup", validate(signUpValidationSchema), controller.signup);

router.post("/signin", validate(signInValidationSchema), controller.signin);

router.post("/verify", validate(verifyOtpValidationSchema), controller.verify);

router.post(
  "/refresh-token",
  validate(refreshTokenValidationSchema),
  controller.refreshToken
);

router.post("/logout", validate(logOutValidationSchema), controller.logout);

export default router;
