import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";
import { WorkoutPlanService } from "../services";
import { changeResponse } from "./../utils/changeResponse";
import { IUser } from "database/models/user";

export class WorkoutPlanController {
  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WorkoutPlanService.findAll(req);

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
      const created = await WorkoutPlanService.create(bod);
      res.status(StatusCodes.OK).json(changeResponse(true, created));
    } catch (e) {
      next(e);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const found = await WorkoutPlanService.find({ _id: req.params.id });

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "workoutplan not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("update workoutPlan");

      res.status(StatusCodes.OK).json(changeResponse(true, { a: "aa" }));
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await WorkoutPlanService.delete(req.params.id);

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
