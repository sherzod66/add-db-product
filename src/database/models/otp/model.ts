import { model, Schema } from "mongoose";
import { IOtp } from ".";

const otpSchema = new Schema<IOtp>({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export const OtpModel = model("Otp", otpSchema);
