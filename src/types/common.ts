import { Request, Response, NextFunction } from "express";

export interface Things<T> {
  [thing: string]: T;
}

export type Handler = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;

export enum ROLES {
  USER = "USER",
  TRAINER = "TRAINER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  ALL = "ALL",
}

export enum LEVEL {
  NEWBIE = "NEWBIE",
  EXPERIENCED = "EXPERIENCED",
  ADVANCED = "ADVANCED",
}

export enum CATEGORY_TYPES {
  EXERCISE = "EXERCISE",
  PRODUCT = "PRODUCT",
  DISH = "DISH",
}

export enum NUTRITION_TYPE {
  FAT = "FAT",
  THIN = "THIN",
}

export type MultiLanguageName = {
  en: string;
  ru: string;
  uz: string;
};
