import { model, Schema, SchemaTypes } from "mongoose";
import { IProduct } from ".";

const productSchema = new Schema<IProduct>(
  {
    name: {
      en: {
        type: String,
        required: true,
        unique: true,
      },
      ru: {
        type: String,
        required: true,
        unique: true,
      },
      uz: {
        type: String,
        required: true,
        unique: true,
      },
    },

    calories: {
      type: Number,
      required: true,
    },

    protein: {
      type: Number,
      required: true,
    },

    oil: {
      type: Number,
      required: true,
    },

    carb: {
      type: Number,
      required: true,
    },

    category: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
    },

    creatorTrainer: {
      type: SchemaTypes.ObjectId,
      ref: "Trainer",
    },

    creatorUser: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const ProductModel = model("Product", productSchema);
