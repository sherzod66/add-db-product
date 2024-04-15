import { model, Schema, SchemaTypes } from "mongoose";
import { IWorkoutPlan } from ".";
import { GENDER, LEVEL } from "./../../../types/common";

const workoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    title: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: [GENDER.ALL, GENDER.MALE, GENDER.FEMALE],
      default: GENDER.MALE,
    },

    level: {
      type: String,
      enum: [LEVEL.NEWBIE, LEVEL.EXPERIENCED, LEVEL.ADVANCED],
      default: LEVEL.NEWBIE,
    },

    week: {
      type: Number,
      required: true,
    },

    creatorTrainer: {
      type: SchemaTypes.ObjectId,
      ref: "Trainer",
      required: false,
    },

    creatorUser: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },

    workouts: {
      type: [
        [
          {
            exercise: {
              type: SchemaTypes.ObjectId,
              ref: "Exercise",
            },
            approach: {
              type: Number,
              required: true,
            },
            repetitions: {
              type: String,
              required: true,
            },
          },
        ],
      ],
    },
  },
  { timestamps: true }
);

export const WorkoutPlanModel = model("WorkoutPlan", workoutPlanSchema);
