import { ExtractJwt } from "passport-jwt";
import { getSeconds } from "../utils/getSeconds";

const JWTConfig = {
  TTL: process.env.JWT_ACCESS_TOKEN_EXP_DATE || 12 * 30 * 24 * 60 * 60 * 1000, // 15min
  TTL2: getSeconds(process.env.JWT_REFRESH_TOKEN_EXP_DATE), // 7days
  Options: {
    audience: "example.com",
    issuer: "api.example.com",
    secretOrKey: process.env.JWT_SECRET || "123",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
} as const;

export default JWTConfig;
