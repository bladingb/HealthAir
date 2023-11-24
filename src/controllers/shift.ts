import { RequestHandler } from "express";

import { CreateShift } from "#/@types/shift";
import Shift from "#/models/shift";
import shift from "#/models/shift";

export const createShift: RequestHandler = async (req: CreateShift, res) => {
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

export const takeShift: RequestHandler = async (req, res) => {
  const shiftId = req.params.id;
  const shift = await Shift.findById(shiftId);
  if (!shift) {
    return res.status(404).json({ message: "Shift not found!" });
  }
  const { status, commentTo } = shift;
  if (status !== "Available") {
    return res.status(400).json({ message: "Shift is not available!" });
  }
  shift.commentTo = commentTo || shift.commentTo;
  shift.userTo = req.user.id;
  shift.status = "Taken";

  await shift.save();

  res.status(200).json({ message: "Shift is taken!", shift });
};

export const deleteShift: RequestHandler = async (req, res) => {
  const shiftId = req.params.id;
  const shift = await Shift.findById(shiftId);
  if (!shift) {
    return res.status(404).json({ message: "Shift not found!" });
  }
  if (shift.status !== "Available") {
    return res.status(400).json({ message: "Shift cannot be deleted!" });
  }
  await Shift.deleteOne({ _id: shiftId });

  res.status(200).json({ message: "Shift is deleted!" });
};

export const cancelShift: RequestHandler = async (req, res) => {
  const shiftId = req.params.id;
  const shift = await Shift.findById(shiftId);
  if (!shift) {
    return res.status(404).json({ message: "Shift not found!" });
  }
  if (shift.status === "Available") {
    return res.status(400).json({ message: "Shift cannot be cancelled!" });
  }

  shift.commentFrom = req.body.commentFrom || shift.commentFrom;
  shift.status = "Cancelled";

  await shift.save();

  res.status(200).json({ message: "Shift is cancelled!", shift });
};

// export const updateShift: RequestHandler = async (req, res) => {
//   const shiftId = req.params.id;
//   const shift = await Shift.findById(shiftId);
//   if (!shift) {
//     return res.status(404).json({ message: "Shift not found!" });
//   }

//   const { wards } = req.user;

//   // Define a type for the ward
//   type WardWithWardName = { wardName: string };

//   // Check if wards is defined and not an empty array
//   const wardOptions = Array.isArray(wards) && wards.length > 0
//     ? (wards as WardWithWardName[]).map((ward) => ward.wardName)
//     : [];

//   shift.wardTo = wardOptions.length > 0 ? wardOptions[0] : shift.wardTo;

//   const { commentFrom } = shift;
//   shift.commentFrom = commentFrom || shift.commentFrom;

//   shift.status = "Updated";

//   await shift.save();

//   res.status(200).json({ message: "Shift is updated!", shift });
// };
