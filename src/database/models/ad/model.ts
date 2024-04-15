import { Schema, model } from "mongoose";
import { IAd } from "./types";

const adModel = new Schema<IAd>({
  imageUrl: String,
  videoUrl: String,
  link: String,
});

export const AdModel = model("ad", adModel);
