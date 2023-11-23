import { Request } from "express";
import { ObjectId } from "mongoose";

export interface CreateShift extends Request {
  body: {
    userFrom: ObjectId;
    commentFrom: string;
    shiftType: string;
    status: string;
    facility: string;
    wardTo: string;
    startTime: Date;
    finishTime: Date;
    nurseLevel: string[];
    employmentType: string;
  };
}
