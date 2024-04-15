import { Document, ObjectId } from "mongoose";
import { MultiLanguageName } from "../../../types/common";
import { CategoryDocument } from "../category";
import { TrainerDocument } from "../trainer";
import { UserDocument } from "../user";

export interface IProduct {
  _id: ObjectId | string;
  name: MultiLanguageName;
  calories: number;
  protein: number;
  oil: number;
  carb: number;
  category: CategoryDocument;
  creatorTrainer?: TrainerDocument;
  creatorUser?: UserDocument;
}

export type ProductDocument = Document & IProduct;

export interface IMyProduct {
  _id?: ObjectId | string;
  name: MultiLanguageName;
  calories: string;
  protein: string;
  oil: string;
  carb: string;
  category: CategoryDocument;
  creatorTrainer?: TrainerDocument;
  creatorUser?: UserDocument;
}
