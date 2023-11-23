import { compare, hash } from "bcrypt";
import { Model, ObjectId, Schema, model } from "mongoose";

// User type
export const users = ["Manager", "NUM", "NIC", "Nurse", "Agency Manager"];
type userTypes = "Manager" | "NUM" | "NIC" | "Nurse" | "Agency Manager";

//Nuser level
export const nurselevels = ["RN", "EN", "AIN", "Security", "Ward Assistant"];
export type nurseLevelsTypes =
  | "RN"
  | "EN"
  | "AIN"
  | "Security"
  | "Ward Assistant";

// Employment type
const employments = ["Full Time", "Part Time", "Casual", "Agency"];
type employmentsTypes = "Full Time" | "Part Time" | "Casual" | "Agency";

// interface for Typescript
export interface UserDocument {
  _id: ObjectId;
  userType: userTypes;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  isVerified: boolean;
  employeeNumber: string;
  nurseLevel: nurseLevelsTypes;
  employmentType: employmentsTypes;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  facility: string;
  wards: ObjectId[];
  agency?: { name: string; phoneNumber: string };
}

interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

// For JS
const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    userType: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    agency: {
      type: Object,
      name: String,
      phoneNumber: String,
    },
    employeeNumber: {
      type: String,
    },
    nurseLevel: {
      type: String,
    },
    employmentType: {
      type: String,
      enum: employments,
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
    },
    facility: {
      type: String,
    },
    wards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ward",
      },
    ],
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Hash token
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);
  return result;
};

export default model("User", userSchema) as Model<UserDocument, {}, Methods>;
