import * as yup from "yup";
import { objectIdRegex } from "./../../constants/regex";

export const dishValidationSchema = yup.object({
  name: yup.string().required(),
  products: yup.array().of(yup.string().matches(objectIdRegex)).required(),
  amounts: yup.array().of(yup.number()).required(),
  category: yup.string().matches(objectIdRegex).required(),
  creator: yup.string().matches(objectIdRegex).required(),
});
