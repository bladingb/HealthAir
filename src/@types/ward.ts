import { Request } from "express";

export interface CreateWard extends Request {
  body: {
    users: string[];
    facility: string;
    department: string;
    wardName: string;
    phoneNumber: string;
    cautions?: string;
    howToFind?: string;
    parking?: string;
    note?: string;
  };
}
