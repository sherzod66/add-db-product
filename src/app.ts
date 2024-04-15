import express, { Express } from "express";
import path from "path";
import http, { Server } from "http";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import api from "./routes";
import AppDatabase from "./database";
import { notfound, generic } from "./middlewares/error";
import bootstrap from "./bootstrap";
import JWTConfig from "./config/jwt";

class App {
  private readonly app: Express = express();
  private readonly database = new AppDatabase();
  private readonly server: Server = http.createServer(this.app);
  private readonly port = process.env.PORT || process.env.SERVER_PORT || "5000";

  public start = async () => {
    try {
      bootstrap();

      await this.database.connect();
      await this.applyMiddlewares();
      this.app.use("/api", api);
      this.app.use("/", (r, s) => {
        s.send("YOU REACHED FITME.UZ");
      });
      this.app.use([notfound, generic]);
      this.app.disable("etag");

      await this.server.listen(this.port, () => {
        console.log(`Server listening at port ${this.port}`);
      });
    } catch (e) {
      throw Error((e as string) || "Error occurred while starting app");
    }
  };

  private applyMiddlewares = async () => {
    this.app.use([
      cors(),
      helmet(),
      compression(),
      express.json(),
      express.urlencoded({ extended: true }),
      express.static(path.join(__dirname, "..", "static")),
      morgan("dev"),
      passport.initialize(),
      session({ secret: JWTConfig.Options.secretOrKey }),
    ]);
  };
}

export default App;
