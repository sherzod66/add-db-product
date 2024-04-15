import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";
import { NutritionPlanService } from "../services";
import { changeResponse } from "../utils/changeResponse";

export class NutritionPlanController {
  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NutritionPlanService.findAll(req);

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      let isSuperAdmin = req.user?.role === "SUPERADMIN";
      let bod = req.body;
      if (isSuperAdmin) {
        bod = { ...req.body, isPublic: true };
      }
      const created = await NutritionPlanService.create(bod);
      res.status(StatusCodes.OK).json(changeResponse(true, created));
    } catch (e) {
      next(e);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const found = await NutritionPlanService.find({ _id: req.params.id });

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "nutritionplan not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("NutritionPlanController update");

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await NutritionPlanService.delete(req.params.id);

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
