import { RequestHandler } from "express";

import { CreateWard } from "#/@types/ward";
import Ward from "#/models/ward";


export const createWard: RequestHandler = async (req: CreateWard, res) => {
  const {
    facility,
    department,
    wardName,
    phoneNumber,
    cautions,
    howToFind,
    parking,
    note,
  } = req.body;

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
  res.status(201).json({ ward });
}

