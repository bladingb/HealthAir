import { CreateShift } from "#/@types/shift";
import { mustAuth } from "#/middleware/auth";
import Shift from "#/models/shift";
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.post(
  "/create",
  mustAuth,
  (req: Request, res: Response, next: NextFunction) => {
    const { wardTo, startTime, finishTime, nurseLevel } = req.body;
    if (!wardTo.trim()) return res.json({ error: "Ward is required" });
    if (!startTime) return res.json({ error: "Start time is required" });
    if (!finishTime) return res.json({ error: "Finish time is required" });
    if (!nurseLevel || !nurseLevel.length) {
      return res.json({ error: "Nurse level is required" });
    }
    next();
  },
  async (req: CreateShift, res) => {
    try {
      const {
        commentFrom,
        shiftType,
        wardTo,
        startTime,
        finishTime,
        nurseLevel,
        employmentType,
      } = req.body;

      const userFrom = req.user.id;
      const status = "Available";
      const facility = req.user.facility;

      const shift = await Shift.create({
        userFrom,
        commentFrom,
        shiftType,
        status,
        facility,
        wardTo,
        startTime,
        finishTime,
        nurseLevel,
        employmentType,
      });

      res.json({ shift });
    } catch (error: any) { // Use ': any' to acknowledge that 'error' could have any type
      // Handle token verification errors
      console.error(error);

      if (error && error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired" });
      }

      return res.status(403).json({ error: "Unauthorized request!" });
    }
  }
);

export default router;
