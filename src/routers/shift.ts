import { cancelShift, createShift, deleteShift, takeShift, updateShift } from "#/controllers/shift";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { CancelShiftSchema, CreateShiftSchema, TakeShiftSchema, UpdateShiftSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", mustAuth, validate(CreateShiftSchema), createShift);
router.patch("/take/:id", mustAuth, validate(TakeShiftSchema), takeShift);
router.patch("/update/:id", mustAuth, validate(UpdateShiftSchema), updateShift);
router.patch("/cancel/:id", mustAuth, validate(CancelShiftSchema), cancelShift);
router.delete("/delete/:id", mustAuth, deleteShift);


export default router;
