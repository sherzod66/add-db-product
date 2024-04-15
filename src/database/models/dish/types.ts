import { Document, ObjectId } from "mongoose";
import { CategoryDocument } from "../category";
import { ProductDocument } from "../product";
import { TrainerDocument } from "../trainer";
import { UserDocument } from "../user";

export interface IDish {
  _id: ObjectId | string;
  name: string;
  products: ProductDocument[];
  amounts: number[];
  category: CategoryDocument;
  creatorTrainer?: TrainerDocument;
  creatorUser?: UserDocument;
}

export type DishDocument = Document & IDish;
