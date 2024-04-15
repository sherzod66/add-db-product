import * as yup from "yup";

export const adValidation = yup.object({
  imageUrl: yup.string(),
  link: yup.string(),
  videoUrl: yup.string(),
});
