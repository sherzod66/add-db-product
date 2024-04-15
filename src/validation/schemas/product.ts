import * as yup from "yup";
import { objectIdRegex } from "../../constants/regex";

export const createProductValidationSchema = yup.object({
  name: yup
    .object()
    .shape({
      en: yup.string().required(),
      ru: yup.string().required(),
      uz: yup.string().required(),
    })
    .required(),
  calories: yup.number().required(),
  protein: yup.number().required(),
  oil: yup.number().required(),
  carb: yup.number().required(),
  category: yup.string().matches(objectIdRegex).required(),
  creator: yup.string().matches(objectIdRegex).required(),
});

export const updateProductValidationSchema = yup.object({
  name: yup
    .object()
    .shape({
      en: yup.string().required(),
      ru: yup.string().required(),
      uz: yup.string().required(),
    })
    .required(),
  calories: yup.number().required(),
  protein: yup.number().required(),
  oil: yup.number().required(),
  carb: yup.number().required(),
});

export const updateProductCategoryValidationSchema = yup.object({
  category: yup.string().matches(objectIdRegex).required(),
});
