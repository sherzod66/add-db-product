import * as yup from "yup";
import { objectIdRegex } from "./../../constants/regex";
import { NUTRITION_TYPE } from "../../types/common";

export const createUserValidationSchema = yup.object({
  name: yup.string().required(),
  phoneNumber: yup.string().required(),
});

export const updateUserNameValidationSchema = yup.object({
  name: yup.string().required(),
});

export const updateUserPhoneNumberValidationSchema = yup.object({
  phoneNumber: yup.string().required(),
});

export const changeWorkoutPlansValidationSchema = yup.object({
  planId: yup.string().matches(objectIdRegex).required(),
});

export const changeFavoriteExercisesValidationSchema = yup.object({
  exerciseId: yup.string().matches(objectIdRegex).required(),
});

export const changeProductsValidationSchema = yup.object({
  productId: yup.string().matches(objectIdRegex).required(),
});

export const addMeasurementKeyValidationSchema = yup.object({
  key: yup.string().required(),
});

export const removeMeasurementKeyValidationSchema = yup.object({
  key: yup.string().required(),
});

export const setMeasurementValueValidationSchema = yup.object({
  key: yup.string().required(),
  value: yup.string().notRequired(),
  index: yup.number().required(),
});

export const setMeasurementDateValidationSchema = yup.object({
  index: yup.number().required(),
  date: yup
    .object()
    .shape({
      year: yup.number().min(2000).max(2050).required(),
      month: yup.number().min(1).max(12).required(),
      day: yup.number().min(1).max(31).required(),
    })
    .required(),
});

export const setSchemaNutritionValidationSchema = yup.object({
  date: yup
    .object()
    .shape({
      year: yup.number().min(2000).max(2050).required(),
      month: yup.number().min(1).max(12).required(),
      day: yup.number().min(1).max(31).required(),
    })
    .required(),
  data: yup.object().shape({
    nType: yup
      .mixed()
      .oneOf([NUTRITION_TYPE.FAT, NUTRITION_TYPE.THIN])
      .required(),
    dailyNorm: yup.number().required(),
    amount: yup.number().required(),
    proteinPercent: yup.number().required(),
    oilPercent: yup.number().required(),
    mergeAmount: yup.number().required(),
    mergeCarb: yup.number().required(),
  }),
  products: yup.array().of(yup.string().matches(objectIdRegex)).required(),
  amountsP: yup.array().of(yup.number()).required(),
  dishes: yup.array().of(yup.string().matches(objectIdRegex)).required(),
  amountsD: yup.array().of(yup.number()).required(),
});

export const setScheduleWorkoutValidationSchema = yup.object({
  planId: yup.string().matches(objectIdRegex).required(),
});

export const setWorkoutResultValidationSchema = yup.object({
  group: yup.number().required(),
  week: yup.number().required(),
  workout: yup.number().required(),
  approach: yup.number().required(),
  weight: yup.number().required(),
  repeat: yup.number().required(),
});
