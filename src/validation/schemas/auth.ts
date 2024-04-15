import * as yup from "yup";

export const signUpValidationSchema = yup.object({
  phone: yup.string().required(),
  name: yup.string().required(),
});

export const signInValidationSchema = yup.object({
  phone: yup.string().required(),
});

export const verifyOtpValidationSchema = yup.object({
  phone: yup.string().required(),
  otp: yup.string().required(),
});

export const refreshTokenValidationSchema = yup.object({
  refreshToken: yup.string().required(),
});

export const logOutValidationSchema = yup.object({
  phone: yup.string().required(),
});
