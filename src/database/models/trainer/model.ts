import { model, Schema, SchemaTypes } from "mongoose";
import { ITrainer } from "./types";
import { ROLES, GENDER } from "./../../../types/common";

const trainerSchema = new Schema<Partial<ITrainer>>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    role: {
      type: String,
      enum: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.TRAINER, ROLES.USER],
      default: ROLES.TRAINER,
    },

    gender: {
      type: String,
      enum: [GENDER.MALE, GENDER.FEMALE, GENDER.ALL],
      default: GENDER.MALE,
    },

    age: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      required: true,
    },

    speciality: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    education: {
      type: String,
      required: true,
    },

    aboutMe: {
      type: String,
      required: true,
    },

    telegramLink: {
      type: String,
      required: true,
    },

    instagramLink: {
      type: String,
      required: true,
    },

    requestedDisciples: {
      type: [SchemaTypes.ObjectId],
      ref: "User",
      default: null
    },

    disciples: {
      type: [SchemaTypes.ObjectId],
      ref: "User",
      default: null
    },

    workoutPlans: {
      type: [SchemaTypes.ObjectId],
      ref: "WorkoutPlan",
      default: null
    },

    products: {
      type: [SchemaTypes.ObjectId],
      ref: "Product",
      default: null
    },

    dishes: {
      type: [SchemaTypes.ObjectId],
      ref: "Dish",
      default: null
    },

    nutritionPlans: {
      type: [SchemaTypes.ObjectId],
      ref: "NutritionPlan",
      default: null
    },
  },
  { timestamps: true }
);

export const TrainerModel = model("Trainer", trainerSchema);
