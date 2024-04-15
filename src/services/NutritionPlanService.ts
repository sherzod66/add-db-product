import { Request } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import {
  INutritionPlan,
  NutritionPlanModel,
} from "../database/models/nutrition";
import { UserModel } from "../database/models/user";
import { TrainerModel } from "../database/models/trainer";
import { ProductModel } from "../database/models/product";
import { DishModel } from "../database/models/dish";
import { NUTRITION_TYPE } from "../types/common";

const populate = [
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
];

const NutritionPlanService = {
  findAll: async (req: Request) => {
    let query: any = {};

    if (req.query.type) {
      if (
        req.query.type !== NUTRITION_TYPE.FAT &&
        req.query.type !== NUTRITION_TYPE.THIN
      ) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Wrong nutrition type");
      }

      query.type = req.query.type;
    }
    query.isPublic = req.query.isPublic;
    return await NutritionPlanModel.find(query).populate(populate);
  },

  create: async (obj: any) => {
    const {
      creatorName,
      title,
      description,
      calories,
      proteinPercent,
      oilPercent,
      type,
      creator,
      nutritions,
      isPublic,
      price,
    } = obj;

    const foundUser = await UserModel.findById(creator);
    const foundTrainer = await TrainerModel.findById(creator);

    if (!(foundUser || foundTrainer)) {
      throw createHttpError(StatusCodes.NOT_FOUND, "creator not found");
    }

    for (let i = 0; i < nutritions.length; i++) {
      for (let j = 0; j < nutritions[i].length; j++) {
        const { products, amountsP, dishes, amountsD } = nutritions[i][j];

        if (products.length === 0 && dishes.length === 0) {
          throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid nutritions");
        }

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
      }
    }

    let creatorr: any = {};

    if (foundUser) {
      creatorr.creatorUser = foundUser._id;
    } else {
      creatorr.creatorTrainer = foundTrainer?._id;
    }

    const created = await NutritionPlanModel.create({
      creatorName,
      title,
      description,
      calories,
      proteinPercent,
      oilPercent,
      type,
      nutritions,
      isPublic,
      price,
      ...creatorr,
    });

    if (foundUser) {
      foundUser.nutritionPlans = [...(foundUser.nutritionPlans ?? []), created];
      await foundUser.save();
    }
    if (foundTrainer) {
      foundTrainer.nutritionPlans = [
        ...(foundTrainer.nutritionPlans ?? []),
        created,
      ];
      await foundTrainer.save();
    }

    return created;
  },

  find: async (
    condition: Partial<INutritionPlan>
  ): Promise<any | null | undefined> => {
    return await NutritionPlanModel.findOne(condition).populate(populate);
  },

  delete: async (id: string) => {
    const foundNutritionPlan: INutritionPlan = await NutritionPlanService.find({
      _id: id,
    });

    if (!foundNutritionPlan) {
      throw createHttpError(StatusCodes.NOT_FOUND, "nutritionPlan not found");
    }

    if (foundNutritionPlan.creatorTrainer) {
      const trainer = await TrainerModel.findById(
        foundNutritionPlan.creatorTrainer
      );

      if (trainer) {
        // @ts-ignore
        trainer.nutritionPlans = trainer.nutritionPlans.filter(
          // @ts-ignore
          (a) => a.toString() !== id
        );
        await trainer.save();
      }
    }

    if (foundNutritionPlan.creatorUser) {
      const user = await UserModel.findById(foundNutritionPlan.creatorUser);

      if (user) {
        // @ts-ignore
        user.nutritionPlans = user.nutritionPlans.filter(
          // @ts-ignore
          (a) => a.toString() !== id
        );
        await user.save();
      }
    }

    await NutritionPlanModel.findByIdAndDelete(id);
  },
};

export default NutritionPlanService;
