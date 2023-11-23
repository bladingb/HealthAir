import {
  generateForgotPasswordLink,
  grantValid,
  logOut,
  sendProfile,
  signIn,
  signUp,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "#/controllers/auth";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIdValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { Router } from "express";
import fileParser, { RequestWithFiles } from "#/middleware/fileParser";

const router = Router();

router.post("/sign-up", validate(CreateUserSchema), signUp);
router.post("/verify-email", validate(TokenAndIdValidation), verifyEmail);
router.post("/forgot-password", generateForgotPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIdValidation),
  isValidPassResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);
router.post("/sign-in", validate(SignInValidationSchema), signIn);
router.get("/is-auth", mustAuth, sendProfile);
router.post("/update-profile", mustAuth, fileParser, updateProfile)
router.post("/log-out", mustAuth, logOut)

export default router;
