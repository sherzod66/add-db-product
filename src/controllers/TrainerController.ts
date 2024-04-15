import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { TrainerDocument, TrainerModel } from "../database/models/trainer";
import { changeResponse } from "./../utils/changeResponse";
import { UserModel } from "./../database/models/user/model";
import { UserDocument } from "./../database/models/user/types";
import { GENDER, ROLES } from "./../types/common";
import { TrainerService, UserService } from "../services";

export class TrainerController {
  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      let query: any = {};

      if (req.query.gender) {
        const condition =
          req.query.gender === GENDER.ALL ||
          req.query.gender === GENDER.MALE ||
          req.query.gender === GENDER.FEMALE;
        if (!condition) {
          throw createHttpError(StatusCodes.BAD_REQUEST, "Wrong gender type");
        }

        if (
          req.query.gender === GENDER.MALE ||
          req.query.gender === GENDER.FEMALE
        ) {
          query.gender = req.query.gender;
        }
      }

      const result = await TrainerModel.find(query).populate([
        "requestedDisciples",
        "disciples",
        "workoutPlans",
      ]);

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { phoneNumber, name, email, ...rest } = req.body;

      const foundTrainer = await TrainerModel.findOne({
        $or: [
          {
            name,
          },
          {
            email,
          },
          {
            phoneNumber,
          },
        ],
      });
      const foundUser = await UserModel.findOne({ phoneNumber });

      if (foundTrainer || foundUser) {
        let wrong = "";

        if (foundTrainer) {
          if (foundTrainer.name === name) {
            wrong = name;
          }
          if (foundTrainer.email === email) {
            wrong = email;
          }
          if (foundTrainer.phoneNumber === phoneNumber) {
            wrong = phoneNumber;
          }
        }

        if (foundUser) {
          wrong = phoneNumber;
        }

        throw createHttpError(
          StatusCodes.BAD_REQUEST,
          `Trainer with "${wrong}" already created`
        );
      }

      const saved = await TrainerModel.create({
        name,
        email,
        phoneNumber,
        ...rest,
      });

      const savedUser = await UserModel.create({
        name,
        email,
        role: ROLES.TRAINER,
        phoneNumber,
      });

      res.status(StatusCodes.CREATED).json(changeResponse(true, saved));
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const found = await TrainerService.find({ _id: req.params.id });

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Trainer not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async findByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const found = await TrainerService.find({ email: req.params.email });

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Trainer not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: _id } = req.params;

      const updated = await TrainerModel.updateOne({ _id }, { ...req.body });

      if (!updated.modifiedCount) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Trainer not found");
      }

      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { ...req.body, _id }));
    } catch (e) {
      next(e);
    }
  }

  public async requestAddTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { discipleId } = req.body;

      const foundTrainer: TrainerDocument = await TrainerService.find({
        _id: req.params.id,
      });

      if (!foundTrainer) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Trainer not found");
      }

      const foundUser: UserDocument | null = await UserModel.findById(
        discipleId
      );

      if (!foundUser) {
        throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
      }

      foundTrainer.requestedDisciples = [
        ...foundTrainer.requestedDisciples,
        foundUser,
      ];

      await foundTrainer.save();
      console.log("====================================");
      console.log(
        "ADDED " + foundUser.name + " TO " + foundTrainer.name + " REQUEST LIST"
      );
      console.log("====================================");
      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { message: "Request sent to trainer" }));
    } catch (e) {
      next(e);
    }
  }

  public async addDisciple(req: Request, res: Response, next: NextFunction) {
    try {
      const { discipleId } = req.body;

      let foundTrainer: TrainerDocument = await TrainerService.find({
        _id: req.params.id,
      });

      if (!foundTrainer) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Trainer not found");
      }

      const foundUser: UserDocument | null | undefined =
        foundTrainer.requestedDisciples.find(
          (a) => a._id.toString() === discipleId
        );

      if (!foundUser) {
        throw createHttpError(
          StatusCodes.BAD_REQUEST,
          "User has not requested yet"
        );
      }

      const user: UserDocument = await UserService.find({ _id: discipleId });

      foundTrainer.requestedDisciples = foundTrainer.requestedDisciples.filter(
        (a) => a._id.toString() !== discipleId
      );
      foundTrainer.disciples = [...foundTrainer.disciples, foundUser];
      await foundTrainer.save();

      user.myTrainers = [...user?.myTrainers, foundTrainer];
      await user?.save();

      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { message: "User successfully added" }));
    } catch (e) {
      next(e);
    }
  }

  public async removeDisciple(req: Request, res: Response, next: NextFunction) {
    try {
      const { discipleId } = req.body;

      const foundTrainer: TrainerDocument = await TrainerService.find({
        _id: req.params.id,
      });

      if (!foundTrainer) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Trainer not found");
      }

      const foundUser: UserDocument = await UserService.find({
        _id: discipleId,
      });

      if (!foundUser) {
        throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
      }

      foundTrainer.disciples = foundTrainer.disciples.filter(
        (a) => a._id.toString() !== discipleId
      );
      foundTrainer.requestedDisciples = foundTrainer.requestedDisciples.filter(
        (a) => a._id.toString() !== discipleId
      );
      foundUser.myTrainers = foundUser.myTrainers?.filter(
        (a) => a._id.toString() !== req.params.id
      );

      await foundTrainer.save();
      await foundUser.save();

      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { message: "User successfully removed" }));
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await TrainerService.delete(req.params.id);

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
