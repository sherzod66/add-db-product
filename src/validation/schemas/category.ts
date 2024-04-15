import * as yup from "yup";
import { objectIdRegex } from "./../../constants/regex";
import { CATEGORY_TYPES } from "../../types/common";

export const categoryValidationSchema = yup.object({
  name: yup
    .object()
    .shape({
      en: yup.string().required(),
      ru: yup.string().required(),
      uz: yup.string().required(),
    })
    .required(),
  type: yup
    .mixed()
    .oneOf([
      CATEGORY_TYPES.EXERCISE,
      CATEGORY_TYPES.PRODUCT,
      CATEGORY_TYPES.DISH,
    ])
    .required(),
  parent: yup.string().matches(objectIdRegex).optional(),
});

export const updateCategoryParentValidationSchema = yup.object({
  parent: yup.string().matches(objectIdRegex).required(),
});

export const updateCategoryChildrenValidationSchema = yup.object({
  children: yup
    .array()
    .of(yup.string().required().matches(objectIdRegex))
    .required(),
});
