import { model, Schema, SchemaTypes } from "mongoose";
import { IDish } from ".";

const dishSchema = new Schema<IDish>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    products: {
      type: [SchemaTypes.ObjectId],
      ref: "Product",
    },

    amounts: {
      type: [Number],
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

export const DishModel = model("Dish", dishSchema);
