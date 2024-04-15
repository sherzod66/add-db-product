import * as yup from "yup";
import { GENDER } from "./../../types/common";
import { emailRegex, objectIdRegex } from "./../../constants/regex";

export const trainerValidationSchema = yup.object({
  name: yup.string().required(),
  phoneNumber: yup.string().required(),
  gender: yup
    .mixed()
    .oneOf([GENDER.MALE, GENDER.FEMALE, GENDER.ALL])
    .required(),
  age: yup.number().required(),
  email: yup.string().email().matches(emailRegex).required(),
  city: yup.string().required(),
  avatar: yup.string().required(),
  speciality: yup.string().required(),
  experience: yup.number().required(),
  education: yup.string().required(),
  aboutMe: yup.string().required(),
  telegramLink: yup.string().required(),
  instagramLink: yup.string().required(),
});

export const discipleValidationSchema = yup.object({
  discipleId: yup.string().matches(objectIdRegex).required(),
});
