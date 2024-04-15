import { model, Schema, SchemaTypes } from "mongoose";
import { INutritionPlan } from "./types";
import { NUTRITION_TYPE } from "../../../types/common";

const nutritionPlanSchema = new Schema<INutritionPlan>(
  {
    creatorName: {
      type: String,
      required: true,
    },

    price: { type: Number, required: false },

    isPublic: {
      type: Boolean,
      required: false,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    calories: {
      type: Number,
      required: true,
    },

    oilPercent: {
      type: Number,
      required: true,
    },

    proteinPercent: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: [NUTRITION_TYPE.FAT, NUTRITION_TYPE.THIN],
      default: NUTRITION_TYPE.FAT,
    },

    creatorUser: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },

    creatorTrainer: {
      type: SchemaTypes.ObjectId,
      ref: "Trainer",
      required: false,
    },

    nutritions: {
      type: [
        [
          {
            products: {
              type: [SchemaTypes.ObjectId],
              ref: "Product",
            },
            amountsP: [Number],
            dishes: {
              type: [SchemaTypes.ObjectId],
              ref: "Dish",
            },
            amountsD: [Number],
            recommendation: {
              type: String,
              required: true,
            },
          },
        ],
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const NutritionPlanModel = model("NutritionPlan", nutritionPlanSchema);
