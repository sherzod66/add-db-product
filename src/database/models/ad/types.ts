import { ObjectId, Document } from "mongoose";

export interface IAd {
  _id: ObjectId;
  link: string;
  videoUrl: string;
  imageUrl: string;
}

export type IAdDocument = Document & IAd;
