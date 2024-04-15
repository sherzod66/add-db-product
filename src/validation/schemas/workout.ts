import * as yup from "yup";
import { GENDER, LEVEL } from "./../../types/common";
import { objectIdRegex } from "./../../constants/regex";

export const createWorkoutPlanValidationSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  gender: yup
    .mixed()
    .oneOf([GENDER.MALE, GENDER.FEMALE, GENDER.ALL])
    .required(),
  level: yup
    .mixed()
    .oneOf([LEVEL.NEWBIE, LEVEL.EXPERIENCED, LEVEL.ADVANCED])
    .required(),
  week: yup.number().min(4).required(),
  creator: yup.string().matches(objectIdRegex).required(),
  workouts: yup
    .array()
    .of(
      yup
        .array()
        .of(
          yup.object().shape({
            exercise: yup.string().matches(objectIdRegex).required(),
            approach: yup.number().min(1).required(),
            repetitions: yup.string().required(),
          })
        )
        .min(1)
        .required()
    )
    .min(1)
    .required(),
});
