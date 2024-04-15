import { sign, decode } from "jsonwebtoken";
import { Types } from "mongoose";

import JWTConfig from "../config/jwt";

const JWTService = {
  signAccessToken: (subject: string, payload: object) => {
    const { issuer, audience, secretOrKey } = JWTConfig.Options;

    return new Promise<string>((resolve, reject) => {
      sign(
        payload,
        secretOrKey,
        {
          issuer: issuer,
          audience: audience,
          subject: String(subject),
          expiresIn: JWTConfig.TTL,
        },
        (error, token) => {
          if (error) {
            return reject(error);
          }

          resolve(token || "");
        }
      );
    });
  },

  signRefreshToken: (subject: string, payload: object) => {
    const { issuer, audience, secretOrKey } = JWTConfig.Options;

    return new Promise<string>((resolve, reject) => {
      sign(
        payload,
        secretOrKey,
        {
          issuer: issuer,
          audience: audience,
          subject: String(subject),
          expiresIn: JWTConfig.TTL2,
        },
        (error, token) => {
          if (error) {
            return reject(error);
          }

          resolve(token || "");
        }
      );
    });
  },
};

export default JWTService;
