import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import user, { nurselevels } from "#/models/user";
import { shifts } from "#/models/shift";

export const CreateUserSchema = yup.object().shape({
  userType: yup.string().required("User type is missing!"),
  fullName: yup
    .string()
    .trim()
    .required("Name is missing!")
    .min(5, "Name is too short!")
    .max(20, "Name is too long!"),
  email: yup.string().required("Email is missing!").email("Invalid email!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    ),
});

export const TokenAndIdValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is missing!").email("Invalid email!"),
  password: yup.string().trim().required("Password is missing!"),
});

// Shift Schemas
export const CreateShiftSchema = yup.object().shape({
  shiftType: yup.string().oneOf(shifts, "Choose one of the shift types!"),
  wardTo: yup.string().trim().required("Choose your ward!"),
  startTime: yup
    .date()
    .min(new Date(Date.now()), "Invalid date!")
    .required("Start time is missing!"),
  finishTime: yup
    .date()
    .min(yup.ref("startTime"), "Finish time must be later than start time!")
    .required("Finish time is missing!"),
  nurseLevel: yup
    .array()
    .of(yup.string().oneOf(nurselevels, "Choose one or more nurse levels!")),
});

export const TakeShiftSchema = yup.object().shape({
  commentTo: yup.string().trim(),
});

export const CancelShiftSchema = yup.object().shape({
  commentFrom: yup.string().trim().required("Comment is missing!"),
});

export const UpdateShiftSchema = yup.object().shape({
  startTime: yup
    .date()
    .min(new Date(Date.now()), "Invalid date!")
    .required("Start time is missing!"),
  finishTime: yup
    .date()
    .min(yup.ref("startTime"), "Finish time must be later than start time!")
    .required("Finish time is missing!"),
  commentFrom: yup.string().trim(),
  wardTo: yup.string().trim().required("Choose a ward!"),
});

// Ward Schemas
export const CreateWardSchema = yup.object().shape({
  facility: yup.string().trim().required("Facility name is missing!"),
  department: yup.string().trim().required("Department name is missing!"),
  wardName: yup.string().trim().required("Ward name is missing!"),
  phoneNumber: yup.string().trim().required("Phone number is missing!"),
});
