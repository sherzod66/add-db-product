import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

export class UploadController {
  public async image(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      if (!req.files?.["image"]) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "No file selected");
      }

      res
        .status(StatusCodes.OK)
        // @ts-ignore
        .json({ src: `/images/${req.files?.image[0].filename}` });
    } catch (e) {
      console.log("e!: ", e);
      next(e);
    }
  }

  public async video(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      if (!req.files?.["video"]) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "No file selected");
      }

      res
        .status(StatusCodes.OK)
        // @ts-ignore
        .json({ src: `/videos/${req.files?.video[0].filename}` });
    } catch (e) {
      console.log("e!!: ", e);
      next(e);
    }
  }
}
