import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { ExerciseService } from "../services";
import { ExerciseModel, IExercise } from "../database/models/exercise";
import { changeResponse } from "./../utils/changeResponse";

export class ExerciseController {
  public async find(req: Request, res: Response, next: NextFunction) {
    let query: any = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    try {
      const result = await ExerciseModel.find(query).populate("category");

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await ExerciseService.create(req.body);

      res.status(StatusCodes.CREATED).json(changeResponse(true, created));
    } catch (e) {
      next(e);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const found = await ExerciseService.find({ _id: req.params.id });

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Exercise not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: _id } = req.params;
      const { title, video, image, description, metadescription } = req.body;

      const updated = await ExerciseModel.updateOne(
        { _id },
        { title, video, image, description, metadescription }
      );

      if (!updated.modifiedCount) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Exercise not found");
      }

      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { ...req.body, _id }));
    } catch (e) {
      next(e);
    }
  }

  public async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise: IExercise = await ExerciseService.updateCategory(
        req.params.id,
        req.body.category
      );

      res.status(StatusCodes.OK).json(changeResponse(true, exercise));
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ExerciseService.delete(req.params.id);

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
