import { model, Schema, SchemaTypes } from "mongoose";
import { IExercise } from "./types";

const exerciseSchema = new Schema<IExercise>(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    video: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    metadescription: {
      type: String,
      required: true,
    },

    category: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export const ExerciseModel = model("Exercise", exerciseSchema);
