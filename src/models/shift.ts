import { Date, Model, ObjectId, Schema, model, models } from "mongoose";
import { nurselevels } from "./user";

// Shift type
export const shifts = ["Call In Sick", "Shift Swap", "NIC Request"];
type shiftTypes = "Call In Sick" | "Shift Swap" | "NIC Request";

// interface for Typescript

// To do : multiple selection of nurse level,
export interface ShiftDocument {
  _id: ObjectId;
  userFrom: ObjectId;
  commentFrom?: string;
  userTo?: ObjectId;
  commentTo?: string;
  shiftType: shiftTypes;
  status: string;
  facility: string;
  wardFrom?: string;
  wardTo: string;
  startTime: Date;
  finishTime: Date;
  nurseLevel: string[];
  employmentType: string;
  isASAP?: boolean;
}

// For JS
const ShiftSchema = new Schema<ShiftDocument>(
  {
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentFrom: {
      type: String,
      trim: true,
    },
    userTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    commentTo: {
      type: String,
      trim: true,
    },
    shiftType: {
      type: String,
      enum: shifts,
    },
    status: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    finishTime: {
      type: Date,
      required: true,
    },
    nurseLevel: {
      type: [String],
      enum: nurselevels,
      required: true,
    },
    employmentType: {
      type: String,
    },
    wardFrom: {
      type: String,
    },
    wardTo: {
      type: String,
      required: true,
    },
    isASAP: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Shift", ShiftSchema) as Model<ShiftDocument>;
