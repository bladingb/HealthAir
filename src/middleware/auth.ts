import { RequestHandler } from "express";
import PasswordResetToken from "#/models/passwordResetToken";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "#/utils/variables";
import User from "#/models/user";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;

  const resetToken = await PasswordResetToken.findOne({ owner: userId });
  if (!resetToken)
    return res
      .status(403)
      .json({ error: "Unauthorized access. Invalid token!" });

  const matched = await resetToken.compareToken(token);
  if (!matched)
    return res
      .status(403)
      .json({ error: "Unauthorized access. Invalid token!" });

  next();
};

export const mustAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];
  if (!token) return res.status(403).json({ error: "Unauthorized request!" });

  const payload = verify(token, JWT_SECRET) as JwtPayload;
  const id = payload.userId;

  const user = await User.findOne({ _id: id, tokens: token });
  if (!user) return res.status(403).json({ error: "Unauthorized request!" });

  req.user = {
    id: user._id,
    userType: user.userType,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified,
    agency: user.agency?.name,
    employeeNumber: user.employeeNumber,
    nurseLevel: user.nurseLevel,
    employmentType: user.employmentType,
    avatar: user.avatar?.url,
    facility: user.facility,
    wards: user.wards,
  };
  req.token = token;

  next();
};
