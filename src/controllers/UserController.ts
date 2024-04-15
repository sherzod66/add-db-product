import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { IUser } from "./../database/models/user";
import { changeResponse } from "./../utils/changeResponse";
import { UserService } from "./../services";

export class UserController {
  public async me(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const { createdAt, updatedAt, ...rest } = req.user ?? {};

      // @ts-ignore
      res.status(StatusCodes.OK).json(changeResponse(true, rest._doc));
    } catch (e) {
      next(e);
    }
  }

  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.findAll();

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const saved = await UserService.create(req.body);

      res.status(StatusCodes.CREATED).json(changeResponse(true, saved));
    } catch (e) {
      next(e);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      let found: IUser = req.user;

      if (req.params.id !== found._id.toString()) {
        // @ts-ignore
        found = await UserService.find({ _id: req.params.id });
      }

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async updateName(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateName(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async updateNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateNumber(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async updateProAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.updateProAccount(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async addWorkoutPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.addWorkoutPlan(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async removeWorkoutPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.removeWorkoutPlan(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async addFavoriteExercise(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.addFavoriteExercise(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async removeFavoriteExercise(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.removeFavoriteExercise(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.addProduct(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async removeProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.removeProduct(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async addMeasurementRow(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.addMeasurementRow(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async removeMeasurementRow(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.removeMeasurementRow(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async addMeasurementKey(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.addMeasurementKey(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async removeMeasurementKey(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.removeMeasurementKey(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async setMeasurementValue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.setMeasurementValue(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async setMeasurementDate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.setMeasurementDate(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async setSchemaNutrition(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.setSchemaNutrition(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async setScheduleWorkout(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.setScheduleWorkout(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async setWorkoutResult(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.setWorkoutResult(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async finishScheduleWorkout(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await UserService.finishScheduleWorkout(req);

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.delete(req.params.id);

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
