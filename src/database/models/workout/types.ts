import { TrainerDocument } from "./../trainer/types";
import { UserDocument } from "./../user/types";
import { GENDER, LEVEL } from "./../../../types/common";
import { IExercise } from "./../exercise/types";
import { Document, ObjectId } from "mongoose";

export interface IWorkoutPlan {
  _id: ObjectId | string;
  title: string;
  isPublic: boolean;
  description: string;
  price: number;
  gender: GENDER;
  level: LEVEL;
  week: number;
  creatorTrainer?: TrainerDocument;
  creatorUser?: UserDocument;
  workouts: IWorkout[][];
}

export interface IWorkout {
  exercise: IExercise;
  approach: number;
  repetitions: number;
}

export type WorkoutPlanDocument = Document & IWorkoutPlan;
