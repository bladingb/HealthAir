import { Request } from "express";
import { ObjectId } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: any;
        userType: string;
        fullName: string;
        email: string;
        phoneNumber: string;
        isVerified: boolean;
        agency?: string;
        employeeNumber: string;
        nurseLevel: string;
        employmentType: string;
        avatar?: string;
        facility: string;
        wards: ObjectId[];
      };
      token: string;
    }
  }
}

export interface CreateUser extends Request {
  body: {
    userType: string;
    fullName: string;
    email: string;
    password: string;
  };
}

export interface VerifyEmailRequest extends Request {
  body: {
    token: string;
    userId: string;
  };
}
