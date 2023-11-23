import { UserDocument } from "#/models/user";

export const generateToken = (length = 6) => {
  let otp = "";

  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10);
    otp += digit;
  }

  return otp;
};

export const formatProfile = (user : UserDocument) => {
  return {
    id: user._id,
    userType: user.userType,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified,
    employer: user.employer,
    employeeNumber: user.employeeNumber,
    nurseLevel: user.nurseLevel,
    employmentType: user.employmentType,
    avatar: user.avatar?.url,
    facility: user.facility,
    wards: user.wards,
  }
}