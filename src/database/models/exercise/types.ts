import { Document, ObjectId } from "mongoose";
import { CategoryDocument } from "../category";

export interface IExercise {
  _id: string | ObjectId;
  title: string;
  video: string;
  image: string;
  description: string;
  metadescription: string;
  category: CategoryDocument;
}

export type ExerciseDocument = Document & IExercise;
