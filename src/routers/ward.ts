import { NextFunction, Request, Response, Router } from "express";
import Ward from "#/models/ward";
import { CreateWard } from "#/@types/ward";
import { mustAuth } from "#/middleware/auth";

const router = Router();

router.post(
  "/create",
  mustAuth,
  (req: Request, res: Response, next: NextFunction) => {
    const { facility, department, wardName, phoneNumber } = req.body;
    if (!facility.trim())
      return res.json({ error: "Facility name is required" });
    if (!department.trim())
      return res.json({ error: "Department name is required" });
    if (!wardName.trim()) return res.json({ error: "Ward name is required" });
    if (!phoneNumber.trim())
      return res.json({ error: "Phone number is required" });
    next(); // Add this line to call the next middleware or route handler
  },
  async (req: CreateWard, res) => {
    const {
      wardName,
      department,
      phoneNumber,
      cautions,
      howToFind,
      parking,
      note,
    } = req.body;

    const facility = req.user.facility;
    const users = req.user.id;

    const ward = await Ward.create({
      facility,
      department,
      wardName,
      phoneNumber,
      users,
      cautions,
      howToFind,
      parking,
      note,
    });
    res.json({ ward });
  }
);

export default router;
