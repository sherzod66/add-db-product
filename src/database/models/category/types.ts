import { Document, ObjectId } from "mongoose";
import { CATEGORY_TYPES, MultiLanguageName } from "./../../../types/common";
import { IMyProduct, IProduct } from "../product";

export interface ICategory {
  _id: ObjectId | string;
  name: MultiLanguageName;
  type: CATEGORY_TYPES;
  parent?: ObjectId;
  children?: ICategory[];
}

export type CategoryDocument = Document & ICategory;

export interface IMyCustomCategory
  extends Omit<ICategory, "children" | "parent"> {
  producs: IMyProduct[];
}
