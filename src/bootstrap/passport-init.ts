import passport from "passport";
import { Strategy } from "passport-jwt";
import { TrainerService, UserService } from "../services";
import JWTConfig from "../config/jwt";

passport.serializeUser((user: Express.User, done) => done(null, user));

passport.deserializeUser((user: Express.User, done) => done(null, user));

const init = () => {
  passport.use(
    new Strategy(JWTConfig.Options, async (payload, done) => {
      try {
        let usr = await UserService.find({ _id: payload.sub });
        if (usr) {
          done(null, usr);
        } else {
          usr = await TrainerService.find({ _id: payload.sub });
          usr ? done(null, usr) : done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    })
  );
};

export default init;
