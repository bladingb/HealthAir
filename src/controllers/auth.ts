import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { formatProfile, generateToken } from "#/utils/helper";
import {
  sendForgotPasswordLink,
  sendPassResetSuccessEmail,
  sendVerificationMail,
} from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import { RequestWithFiles } from "#/middleware/fileParser";
import cloudinary from "#/cloud";
import formidable from "formidable";

export const signUp: RequestHandler = async (req: CreateUser, res) => {
  const { userType, fullName, email, password } = req.body;

  const user = await User.create({ userType, fullName, email, password });

  // Send verification email
  const token = generateToken();
  sendVerificationMail(token, { fullName, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, fullName, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken?.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    isVerified: true,
  });
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified!" });
};

export const generateForgotPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found!" });

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgotPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check your email." });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res.status(422).json({ error: "New password must be different!" });

  user.password = password;
  await user.save();

  PasswordResetToken.findOneAndDelete({ owner: user._id });
  //Send a success email
  sendPassResetSuccessEmail(user.fullName, user.email);
  res.json({ message: "Password reset successful!" });
};

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(403).json({ error: "Email & password mismatching!" });
  }

  // Compare password
  const matched = await user.comparePassword(password);
  if (!matched) {
    return res.status(403).json({ error: "Email & password mismatching!" });
  }

  // Generate token without expiration
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  // Add the token to the user's tokens array
  user.tokens.push(token);

  // Save the user
  await user.save();

  res.json({
    profile: {
      id: user._id,
      userType: user.userType,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified,
      agency: user.agency,
      employeeNumber: user.employeeNumber,
      nurseLevel: user.nurseLevel,
      employmentType: user.employmentType,
      avatar: user.avatar?.url,
      facility: user.facility,
      wards: user.wards,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { fullName } = req.body;
  const avatar = req.files?.avatar as formidable.File;

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something went wrong. User not found!");

  if (typeof fullName !== "string")
    return res.status(422).json({ error: "Invalid name!" });

  if (fullName.trim().length < 3)
    return res.status(422).json({ error: "Invalid name!" });

  user.fullName = fullName;

  if (avatar) {
    // Remove previous avatar file
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    }

    // Upload new file
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      }
    );

    user.avatar = { url: secure_url, publicId: public_id };
  }

  await user.save();

  res.json({ profile: formatProfile(user) });
};

export const sendProfile: RequestHandler = (req, res) => {
  res.json({ profile: req.user });
};

export const logOut: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;

  const token = req.token;
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new Error("Something went wrong. User not found!");
  }

  if (fromAll === "yes") {
    // Clear all tokens if fromAll is set to "yes"
    user.tokens = [];
  } else {
    // Remove the specific token from the user's tokens array
    user.tokens = user.tokens.filter((t) => t !== token);
  }

  await user.save();
  res.json({ success: true });
};
