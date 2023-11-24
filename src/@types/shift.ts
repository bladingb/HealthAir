import { Request } from "express";
import { ObjectId } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      shift: {
        id: any;
        userFrom: ObjectId;
        commentFrom?: string;
        userTo?: ObjectId;
        commentTo?: string;
        shiftType: string;
        status: string;
        facility: string;
        wardFrom?: string;
        wardTo: string;
        startTime: Date;
        finishTime: Date;
        nurseLevel: string[];
        employmentType: string;
        isASAP?: boolean;
      };
    }
  }
}

export interface CreateShift extends Request {
  body: {
    userFrom: ObjectId;
    commentFrom: string;
    userTo: ObjectId;
    commentTo: string;
    shiftType: string;
    status: string;
    facility: string;
    wardFrom: string;
    wardTo: string;
    startTime: Date;
    finishTime: Date;
    nurseLevel: string[];
    employmentType: string;
    isASAP: boolean;
  };
}

export interface TakeShift extends Request {
  body: {
    userTo: ObjectId;
    commentTo: string;
    status: string;
  };
}