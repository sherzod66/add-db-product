import * as yup from "yup";
import { NUTRITION_TYPE } from "../../types/common";
import { objectIdRegex } from "../../constants/regex";

export const createNutritionPlanValidationSchema = yup.object({
  creatorName: yup.string().required(),
  title: yup.string().required(),
  description: yup.string().required(),
  calories: yup.number().required(),
  proteinPercent: yup.number().required(),
  oilPercent: yup.number().required(),
  type: yup.mixed().oneOf([NUTRITION_TYPE.FAT, NUTRITION_TYPE.THIN]).required(),
  creator: yup.string().matches(objectIdRegex).required(),
  nutritions: yup
    .array()
    .of(
      yup
        .array()
        .of(
          yup.object().shape({
            products: yup
              .array()
              .of(yup.string().matches(objectIdRegex))
              .required(),
            amountsP: yup.array().of(yup.number()).required(),
            dishes: yup
              .array()
              .of(yup.string().matches(objectIdRegex))
              .required(),
            amountsD: yup.array().of(yup.number()).required(),
            recommendation: yup.string().required().required(),
          })
        )
        .required()
    )
    .required(),
});
