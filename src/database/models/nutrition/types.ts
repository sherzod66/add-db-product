import { Document, ObjectId } from "mongoose";
import { IProduct } from "../product";
import { NUTRITION_TYPE } from "../../../types/common";
import { IDish } from "../dish";
import { UserDocument } from "../user";
import { TrainerDocument } from "../trainer";

export interface INutritionPlan {
  _id: ObjectId | string;
  isPublic: boolean;
  price: number;
  creatorName: string;
  title: string;
  description: string;
  calories: number;
  oilPercent: number;
  proteinPercent: number;
  type: NUTRITION_TYPE;
  creatorUser?: UserDocument;
  creatorTrainer?: TrainerDocument;
  nutritions: INutrition[][];
}

export interface INutrition {
  products: IProduct[];
  amountsP: number[];
  dishes: IDish[];
  amountsD: number[];
  recommendation: string;
}

export type NutritionPlanDocument = Document & INutritionPlan;
