import { Document } from "mongoose";

export interface IOtp {
  phone: string;
  name?: string;
  otp: string;
  date: Date;
}

export type OtpDocument = Document & IOtp;
