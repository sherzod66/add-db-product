import { AdModel } from "../database/models/ad";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { changeResponse } from "../utils/changeResponse";

export class AdController {
  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdModel.find();

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await AdModel.create(req.body);

      res.status(StatusCodes.OK).json(changeResponse(true, created));
    } catch (e) {
      next(e);
    }
  }
  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("PARAMS", req.params);

      await AdModel.deleteOne({ _id: req.params.id });

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
