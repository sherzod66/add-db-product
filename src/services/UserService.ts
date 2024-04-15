import { Request } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import TrainerService from "./TrainerService";
import {
  IUser,
  UserModel,
  SchemaNutrition,
  ScheduleWorkout,
} from "../database/models/user";
import { TrainerModel } from "../database/models/trainer";
import { OtpModel } from "../database/models/otp";
import { ExerciseModel } from "../database/models/exercise";
import { WorkoutPlanModel } from "../database/models/workout";
import { ProductModel } from "../database/models/product";
import { DishModel } from "../database/models/dish";

const populate = [
  "myTrainers",
  {
    path: "favoriteExercises",
    populate: {
      path: "category",
    },
  },
  {
    path: "workoutPlans",
    populate: {
      path: "workouts",
      populate: {
        path: "exercise",
        model: "Exercise",
      },
    },
  },
  {
    path: "scheduleWorkouts",
    populate: [
      {
        path: "executor",
      },
      {
        path: "plan",
        populate: {
          path: "workouts",
          populate: "exercise",
        },
      },
    ],
  },
  {
    path: "products",
    populate: ["category", "creatorUser", "creatorTrainer"],
  },
  {
    path: "dishes",
    populate: [
      { path: "products", populate: "category" },
      "category",
      "creatorUser",
      "creatorTrainer",
    ],
  },
  {
    path: "nutritionPlans",
    populate: [
      "creatorUser",
      "creatorTrainer",
      {
        path: "nutritions",
        populate: [
          {
            path: "products",
            populate: ["category", "creatorUser", "creatorTrainer"],
          },
          {
            path: "dishes",
            populate: [
              { path: "products", populate: "category" },
              "category",
              "creatorUser",
              "creatorTrainer",
            ],
          },
        ],
      },
    ],
  },
  {
    path: "schemaNutritions",
    populate: [
      {
        path: "products",
        populate: "category",
      },
      {
        path: "dishes",
        populate: [{ path: "products", populate: "category" }, "category"],
      },
    ],
  },
];

const UserService = {
  findAll: async () => {
    return await UserModel.find().populate(populate);
  },

  create: async (obj: any) => {
    const { phoneNumber, name } = obj;

    const foundByPhoneNumber1 = await UserService.find({ phoneNumber });
    const foundByPhoneNumber2 = await TrainerService.find({ phoneNumber });

    if (foundByPhoneNumber1 || foundByPhoneNumber2) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        `User with "${phoneNumber}" already created`
      );
    }

    const foundByName = await UserService.find({ name });

    if (foundByName) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        `User with "${name}" already created`
      );
    }

    const saved = await UserModel.create({
      name,
      phoneNumber,
    });

    return saved;
  },

  find: async (condition: Partial<IUser>): Promise<any | null | undefined> => {
    return await UserModel.findOne(condition).populate(populate);
  },

  updateName: async (req: Request) => {
    // @ts-ignore
    let found: IUser = req.user;

    if (req.params.id !== found._id.toString()) {
      found = await UserService.find({ _id: req.params.id });
    }

    if (!found) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    found.name = req.body.name;
    await UserModel.findByIdAndUpdate(req.params.id, found);

    return found;
  },

  updateNumber: async (req: Request) => {
    // @ts-ignore
    let found: IUser = req.user;

    if (req.params.id !== found._id.toString()) {
      found = await UserService.find({ _id: req.params.id });
    }

    if (!found) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    found.phoneNumber = req.body.phoneNumber;
    await UserModel.findByIdAndUpdate(req.params.id, found);

    return found;
  },

  updateProAccount: async (req: Request) => {
    // @ts-ignore
    let found: IUser = req.user;

    if (req.params.id !== found._id.toString()) {
      found = await UserService.find({ _id: req.params.id });
    }

    if (!found) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    found.isProAccount = !found.isProAccount;
    await UserModel.findByIdAndUpdate(req.params.id, found);

    return found;
  },

  addWorkoutPlan: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (foundUser.workoutPlans?.length) {
      foundUser.workoutPlans.map((plan) => {
        if (plan._id.toString() === req.body.planId) {
          throw createHttpError(StatusCodes.BAD_REQUEST, "Plan already added");
        }
      });
    }

    const foundPlan = await WorkoutPlanModel.findById(req.body.planId).populate(
      {
        path: "workouts",
        populate: {
          path: "exercise",
          model: "Exercise",
        },
      }
    );

    if (!foundPlan) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Plan not found");
    }

    foundUser.workoutPlans = [...(foundUser.workoutPlans ?? []), foundPlan];
    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  removeWorkoutPlan: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    const findIndex = [...(foundUser.workoutPlans ?? [])].findIndex(
      (a) => a._id.toString() === req.body.planId
    );

    if (!findIndex || findIndex === -1) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Invalid planId");
    }

    let arr = [...foundUser.workoutPlans];
    arr = [...arr.slice(0, findIndex), ...arr.slice(findIndex + 1)];
    foundUser.workoutPlans = [...arr];

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  addFavoriteExercise: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (foundUser.favoriteExercises?.length) {
      foundUser.favoriteExercises.map((exercise) => {
        if (exercise._id.toString() === req.body.exerciseId) {
          throw createHttpError(
            StatusCodes.BAD_REQUEST,
            "Exercise already added"
          );
        }
      });
    }

    const foundExercise = await ExerciseModel.findById(req.body.exerciseId);

    if (!foundExercise) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Exercise not found");
    }

    foundUser.favoriteExercises = [
      ...(foundUser.favoriteExercises ?? []),
      foundExercise,
    ];
    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  removeFavoriteExercise: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    const findIndex = [...(foundUser.favoriteExercises ?? [])].findIndex(
      (a) => a._id.toString() === req.body.exerciseId
    );

    if (findIndex === -1) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Invalid exerciseId");
    }

    let arr = [...foundUser.favoriteExercises];
    arr = [...arr.slice(0, findIndex), ...arr.slice(findIndex + 1)];
    foundUser.favoriteExercises = [...arr];

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  addProduct: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (foundUser.products?.length) {
      foundUser.products.map((product) => {
        if (product._id.toString() === req.body.productId) {
          throw createHttpError(
            StatusCodes.BAD_REQUEST,
            "Product already added"
          );
        }
      });
    }

    const foundProduct = await ProductModel.findById(req.body.productId);

    if (!foundProduct) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Product not found");
    }

    foundUser.products = [...(foundUser.products ?? []), foundProduct];
    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  removeProduct: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    const findIndex = [...(foundUser.products ?? [])].findIndex(
      (a) => a._id.toString() === req.body.productId
    );

    if (findIndex === -1) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Invalid productId");
    }

    let arr = [...foundUser.products];

    if (
      arr[findIndex].creatorUser?._id.toString() === foundUser._id.toString()
    ) {
      await ProductModel.findByIdAndDelete(arr[findIndex]._id);
    }

    arr = [...arr.slice(0, findIndex), ...arr.slice(findIndex + 1)];
    foundUser.products = [...arr];

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  addMeasurementRow: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (foundUser.myMeasurements.length) {
      foundUser.myMeasurements = [
        ...foundUser.myMeasurements,
        {
          date: new Date(Date.now()),
          data: foundUser.myMeasurements[0].data.map((d) => ({
            ...d,
            value: "",
          })),
        },
      ];
    } else {
      foundUser.myMeasurements = [
        {
          date: new Date(Date.now()),
          data: [
            {
              key: "Вес",
              value: "",
            },
          ],
        },
      ];
    }

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  removeMeasurementRow: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (!foundUser.myMeasurements.length) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Empty measurements");
    }

    foundUser.myMeasurements = foundUser.myMeasurements.slice(0, -1);

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  addMeasurementKey: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (!foundUser.myMeasurements.length) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Empty measurements");
    }

    const { key } = req.body;

    if (foundUser.myMeasurements[0].data.find((d) => d.key === key)) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid measurement key");
    }

    foundUser.myMeasurements = foundUser.myMeasurements.map((m) => ({
      ...m,
      data: [...m.data, { key, value: "" }],
    }));

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  removeMeasurementKey: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (!foundUser.myMeasurements.length) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Empty measurements");
    }

    const { key } = req.body;

    if (!foundUser.myMeasurements[0].data.find((d) => d.key === key)) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Invalid measurement key");
    }

    foundUser.myMeasurements = foundUser.myMeasurements.map((m) => ({
      ...m,
      data: m.data.filter((d) => d.key !== key),
    }));

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  setMeasurementValue: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (!foundUser.myMeasurements.length) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Empty measurements");
    }

    const { key, value, index } = req.body;

    if (!foundUser.myMeasurements[0].data.find((d) => d.key === key)) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Invalid measurement key");
    }

    if (!foundUser.myMeasurements[index]) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid index");
    }

    foundUser.myMeasurements[index].data = foundUser.myMeasurements[
      index
    ].data.map((d) => {
      if (d.key === key) {
        d.value = value;
      }

      return d;
    });

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  setMeasurementDate: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (!foundUser.myMeasurements.length) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Empty measurements");
    }

    const {
      index,
      date: { year, month, day },
    } = req.body;

    if (!foundUser.myMeasurements[index]) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid index");
    }

    foundUser.myMeasurements[index].date = new Date(`${year}-${month}-${day}`);

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  setSchemaNutrition: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    const {
      date: { year, month, day },
      data: {
        nType,
        dailyNorm,
        amount,
        proteinPercent,
        oilPercent,
        mergeAmount,
        mergeCarb,
      },
      products,
      amountsP,
      dishes,
      amountsD,
    } = req.body;

    if (
      products.length !== amountsP.length ||
      dishes.length !== amountsD.length
    ) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid amounts");
    }

    for (let l = 0; l < products.length; l++) {
      const foundProduct = await ProductModel.findById(products[l]);

      if (!foundProduct) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Product not found");
      }
    }

    for (let l = 0; l < dishes.length; l++) {
      const foundDish = await DishModel.findById(dishes[l]);

      if (!foundDish) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Dish not found");
      }
    }

    const obj: SchemaNutrition = {
      date: new Date(`${year}-${month}-${day}`),
      data: {
        nType,
        dailyNorm: Number(dailyNorm),
        amount: Number(amount),
        proteinPercent: Number(proteinPercent),
        oilPercent: Number(oilPercent),
        mergeAmount: Number(mergeAmount),
        mergeCarb: Number(mergeCarb),
      },
      products,
      amountsP,
      dishes,
      amountsD,
    };

    const index = foundUser.schemaNutritions
      .map((sN) => {
        const datee = new Date(sN.date);
        const yearr = datee.getFullYear();
        const monthh = datee.getMonth() + 1;
        const dayy = datee.getDate();

        return { yearr, monthh, dayy };
      })
      .findIndex(
        ({ yearr, monthh, dayy }) =>
          yearr === year && monthh === month && dayy === day
      );

    if (index === -1) {
      foundUser.schemaNutritions = [...foundUser.schemaNutritions, obj];
    } else {
      foundUser.schemaNutritions[index] = {
        ...foundUser.schemaNutritions[index],
        ...obj,
      };

      // if (products.length === 0 && dishes.length === 0) {
      //   foundUser.schemaNutritions = [
      //     ...foundUser.schemaNutritions.slice(0, index),
      //     ...foundUser.schemaNutritions.slice(index + 1),
      //   ];
      // } else {
      //   /// ....
      // }
    }

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  setScheduleWorkout: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    const plan = await WorkoutPlanModel.findById(req.body.planId);

    if (!plan) {
      throw createHttpError(StatusCodes.NOT_FOUND, "WorkoutPlan not found");
    }
    let existingPlan = foundUser.scheduleWorkouts.find(
      (e) => e.plan.title === plan.title
    );

    if (!!existingPlan) {
      console.log("EXISTING PLAN", JSON.stringify(existingPlan, null, 4), plan);

      foundUser.scheduleWorkouts = foundUser.scheduleWorkouts.map((e) => {
        if (e.plan.title === plan.title) {
          e.current = true;
          return e;
        }
        if (e.current) {
          e.current = false;
          return e;
        }
        return e;
      });
      await UserModel.findByIdAndUpdate(req.params.id, foundUser);
      return foundUser;
    }
    // if (foundUser.scheduleWorkouts.find((s) => !s.isFinished)) {
    //   throw createHttpError(
    //     StatusCodes.BAD_REQUEST,
    //     "User already have schedule workout"
    //   );
    // }

    let results: any[][][][] = [];

    for (let i = 0; i < plan.workouts.length; i++) {
      let weekResults: any[][][] = [];

      for (let j = 0; j < plan.week; j++) {
        let workoutResults: any[][] = [];

        for (let k = 0; k < plan.workouts[i].length; k++) {
          let approachResults: any[] = [];

          for (let l = 0; l < plan.workouts[i][k].approach; l++) {
            approachResults.push({
              weight: 0,
              repeat: 0,
            });
          }

          workoutResults.push(approachResults);
        }

        weekResults.push(workoutResults);
      }

      results.push(weekResults);
    }
    foundUser.scheduleWorkouts = foundUser.scheduleWorkouts.map((e) => {
      if (e.current) {
        e.current = false;
      }
      return e;
    });
    foundUser.scheduleWorkouts = [
      ...foundUser.scheduleWorkouts,
      {
        isFinished: false,
        activeWeek: 0,
        plan,
        results,
        current: true,
      },
    ];

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  setWorkoutResult: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    const foundIndex = foundUser.scheduleWorkouts.findIndex(
      (s) => !s.isFinished
    );

    if (foundIndex === -1) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        "User has not schedule workout yet"
      );
    }

    const found: ScheduleWorkout = {
      // @ts-ignore
      ...foundUser.scheduleWorkouts[foundIndex]._doc,
    };

    const { group, week, workout, approach, weight, repeat } = req.body;

    if (found.results.length <= group) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid group value");
    }

    if (found.results[group].length <= week) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid week value");
    }

    if (found.results[group][week].length <= workout) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid workout value");
    }

    if (found.results[group][week][workout].length <= approach) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid approach value");
    }

    const results = [...found.results];
    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < results[i].length; j++) {
        for (let k = 0; k < results[i][j].length; k++) {
          for (let l = 0; l < results[i][j][k].length; l++) {
            if (
              i === Number(group) &&
              j === Number(week) &&
              k === Number(workout) &&
              l === Number(approach)
            ) {
              results[i][j][k][l] = {
                weight: Number(weight),
                repeat: Number(repeat),
              };
            }
          }
        }
      }
    }

    found.results = [...results];

    foundUser.scheduleWorkouts[foundIndex] = { ...found };

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  finishScheduleWorkout: async (req: Request) => {
    // @ts-ignore
    let foundUser: IUser = req.user;

    if (req.params.id !== foundUser._id.toString()) {
      foundUser = await UserService.find({ _id: req.params.id });
    }

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    const foundIndex = foundUser.scheduleWorkouts.findIndex(
      (s) => !s.isFinished
    );

    if (foundIndex === -1) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        "User has not schedule workout yet"
      );
    }

    const found = foundUser.scheduleWorkouts[foundIndex];

    found.activeWeek = found.activeWeek + 4;

    if (found.activeWeek === found.plan.week) {
      found.isFinished = true;
    }

    await UserModel.findByIdAndUpdate(req.params.id, foundUser);

    return foundUser;
  },

  delete: async (id: string): Promise<void> => {
    let user: IUser = await UserService.find({ _id: id });

    if (!user) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    await OtpModel.deleteOne({ phone: user.phoneNumber });

    for (let i = 0; i < user.myTrainers.length; i++) {
      let trainer = await TrainerModel.findById(user.myTrainers[i]._id);

      if (trainer && user) {
        trainer.requestedDisciples = trainer.requestedDisciples?.filter(
          (d) => d._id.toString() !== user._id.toString()
        );

        trainer.disciples = trainer.disciples?.filter(
          (d) => d._id.toString() !== user._id.toString()
        );

        await TrainerModel.findByIdAndUpdate(trainer._id, trainer);
      }
    }

    for (let i = 0; i < user.workoutPlans.length; i++) {
      let workoutPlan = await WorkoutPlanModel.findById(
        user.workoutPlans[i]._id
      );

      if (
        workoutPlan &&
        workoutPlan.creatorUser &&
        workoutPlan.creatorUser.toString() === user._id.toString()
      ) {
        await WorkoutPlanModel.findByIdAndDelete(workoutPlan._id);
      }
    }

    for (let i = 0; i < user.products.length; i++) {
      let product = await ProductModel.findById(user.products[i]._id);

      if (
        product &&
        product.creatorUser &&
        product.creatorUser.toString() === user._id.toString()
      ) {
        await ProductModel.findByIdAndDelete(product._id);
      }
    }

    await UserModel.findByIdAndDelete(id);
  },
};

export default UserService;
