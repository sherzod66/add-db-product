import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { DishService } from "../services";
import { changeResponse } from "./../utils/changeResponse";

export class DishController {
  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DishService.findAll(req);

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await DishService.create(req.body);

      res.status(StatusCodes.OK).json(changeResponse(true, created));
    } catch (e) {
      next(e);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const found = await DishService.find({ _id: req.params.id });

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Dish not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("DishController update");

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await DishService.delete(req.params.id);

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
