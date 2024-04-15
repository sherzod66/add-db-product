import { Vonage } from "@vonage/server-sdk";

export const vonage = new Vonage({
  // @ts-ignore
  apiKey: process.env.VONAGE_API_KEY,
  // @ts-ignore
  apiSecret: process.env.VONAGE_API_SECRET,
});
