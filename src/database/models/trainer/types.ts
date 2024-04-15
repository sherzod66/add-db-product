import { Document, ObjectId } from "mongoose";
import { DishDocument } from "../dish";
import { NutritionPlanDocument } from "../nutrition";
import { ProductDocument } from "../product";
import { UserDocument } from "../user";
import { ROLES, GENDER } from "./../../../types/common";
import { WorkoutPlanDocument } from "./../workout/types";

export interface ITrainer {
  _id: ObjectId | string;
  name: string;
  phoneNumber: string;
  email: string;
  role: ROLES;
  gender: GENDER;
  age: number;
  city: string;
  avatar: string;
  speciality: string;
  experience: number;
  education: string;
  aboutMe: string;
  telegramLink: string;
  instagramLink: string;
  requestedDisciples: UserDocument[];
  disciples: UserDocument[];
  workoutPlans: WorkoutPlanDocument[];
  products: ProductDocument[];
  dishes: DishDocument[];
  nutritionPlans: NutritionPlanDocument[];
}

export type TrainerDocument = Document & ITrainer;
