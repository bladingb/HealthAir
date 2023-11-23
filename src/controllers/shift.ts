import { RequestHandler } from "express";

import { CreateShift } from "#/@types/shift";
import Shift from "#/models/shift";

export const createShift: RequestHandler = async (req: CreateShift, res) => {
    console.log(req.body);
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

  res.status(201).json({ shift });
};
