import { CATEGORY_TYPES } from "./../../../types/common";
import { model, Schema, SchemaTypes } from "mongoose";
import { ICategory } from "./types";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      en: String,
      ru: String,
      uz: String,
    },

    type: {
      type: String,
      enum: [
        CATEGORY_TYPES.EXERCISE,
        CATEGORY_TYPES.PRODUCT,
        CATEGORY_TYPES.DISH,
      ],
      default: CATEGORY_TYPES.EXERCISE,
    },

    parent: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
      required: false,
    },

    children: {
      type: [SchemaTypes.ObjectId],
      ref: "Category",
    },
  },
  { timestamps: true }
);

export const CategoryModel = model("Category", categorySchema);
