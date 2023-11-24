import { NextFunction, Request, Response, Router } from "express";
import Ward from "#/models/ward";
import { CreateWard } from "#/@types/ward";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { CreateWardSchema } from "#/utils/validationSchema";
import { createWard } from "#/controllers/ward";

const router = Router();

router.post(
  "/create",
  mustAuth,
  validate(CreateWardSchema), createWard
);

export default router;
