import { Request } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { IWorkoutPlan, WorkoutPlanModel } from "../database/models/workout";
import { TrainerModel } from "../database/models/trainer";
import { UserModel } from "../database/models/user";
import { ExerciseModel } from "../database/models/exercise";
import { GENDER, LEVEL } from "../types/common";

const populate = [
  "creatorTrainer",
  "creatorUser",
  {
    path: "workouts",
    populate: {
      path: "exercise",
      model: "Exercise",
    },
  },
];

const WorkoutPlanService = {
  findAll: async (req: Request) => {
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

    if (req.query.level) {
      const condition =
        req.query.level === LEVEL.NEWBIE ||
        req.query.level === LEVEL.EXPERIENCED ||
        req.query.level === LEVEL.ADVANCED;

      if (!condition) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Wrong level type");
      }

      query.level = req.query.level;
    }
    query.isPublic = req.query.isPublic;

    const foundResult = await WorkoutPlanModel.find(query).populate(populate);

    const result = foundResult.map(
      ({ creatorTrainer, creatorUser, ...workoutPlan }) => ({
        // @ts-ignore
        ...workoutPlan._doc,
        creator: creatorTrainer ?? creatorUser,
      })
    );

    return result;
  },

  create: async (obj: any) => {
    const {
      title,
      description,
      price,
      gender,
      level,
      week,
      creator,
      workouts,
      isPublic,
    } = obj;

    const foundUser = await UserModel.findById(creator);
    const foundTrainer = await TrainerModel.findById(creator);

    if (!(foundUser || foundTrainer)) {
      throw createHttpError(StatusCodes.NOT_FOUND, "creator not found");
    }

    for (let i = 0; i < workouts.length; i++) {
      for (let j = 0; j < workouts[i].length; j++) {
        const foundExercise = await ExerciseModel.findById(
          workouts[i][j].exercise
        );

        if (!foundExercise) {
          throw createHttpError(StatusCodes.NOT_FOUND, "exercise not found");
        }
      }
    }

    let creatorr: any = {};

    if (foundUser) {
      creatorr.creatorUser = foundUser._id;
    } else {
      creatorr.creatorTrainer = foundTrainer?._id;
    }

    const created = await WorkoutPlanModel.create({
      title,
      description,
      price,
      gender,
      level,
      week,
      workouts,
      isPublic,
      ...creatorr,
    });

    if (foundUser) {
      // @ts-ignore
      foundUser.workoutPlans = [...foundUser.workoutPlans, created._id];
      await foundUser.save();
    }
    if (foundTrainer) {
      // @ts-ignore
      foundTrainer.workoutPlans = [...foundTrainer.workoutPlans, created._id];
      await foundTrainer.save();
    }

    return created;
  },

  find: async (
    condition: Partial<IWorkoutPlan>
  ): Promise<any | null | undefined> => {
    return await WorkoutPlanModel.findOne(condition).populate(populate);
  },

  delete: async (id: string) => {
    const foundWorkoutPlan: IWorkoutPlan = await WorkoutPlanService.find({
      _id: id,
    });

    if (!foundWorkoutPlan) {
      throw createHttpError(StatusCodes.NOT_FOUND, "workoutplan not found");
    }

    if (foundWorkoutPlan.creatorTrainer) {
      const trainer = await TrainerModel.findById(
        foundWorkoutPlan.creatorTrainer
      );

      if (trainer) {
        // @ts-ignore
        trainer.workoutPlans = trainer.workoutPlans.filter(
          // @ts-ignore
          (a) => a.toString() !== id
        );
        await trainer.save();
      }
    }

    if (foundWorkoutPlan.creatorUser) {
      const user = await UserModel.findById(foundWorkoutPlan.creatorUser);

      if (user) {
        // @ts-ignore
        user.workoutPlans = user.workoutPlans.filter(
          // @ts-ignore
          (a) => a.toString() !== id
        );
        await user.save();
      }
    }

    await WorkoutPlanModel.findByIdAndDelete(id);
  },
};

export default WorkoutPlanService;
