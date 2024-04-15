import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { ITrainer, TrainerModel } from "../database/models/trainer";
import { UserModel } from "../database/models/user";
import { WorkoutPlanModel } from "../database/models/workout";
import { ProductModel } from "../database/models/product";
import { OtpModel } from "../database/models/otp";

const populate = [
  "requestedDisciples",
  "disciples",
  "workoutPlans",
  {
    path: "products",
    populate: ["category", "creatorUser", "creatorTrainer"],
  },
];

const TrainerService = {
  find: async (
    condition: Partial<ITrainer>
  ): Promise<any | null | undefined> => {
    return await TrainerModel.findOne(condition).populate(populate);
  },

  delete: async (id: string): Promise<void> => {
    let trainer: ITrainer = await TrainerService.find({ _id: id });

    if (!trainer) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Trainer not found");
    }

    await OtpModel.deleteOne({ phone: trainer.phoneNumber });

    for (let i = 0; i < trainer.disciples.length; i++) {
      let user = await UserModel.findById(trainer.disciples[i]._id);

      if (user && trainer) {
        user.myTrainers = user.myTrainers?.filter(
          (t) => t._id.toString() !== trainer._id.toString()
        );

        await UserModel.findByIdAndUpdate(user._id, user);
      }
    }

    for (let i = 0; i < trainer.workoutPlans.length; i++) {
      await WorkoutPlanModel.findByIdAndDelete(trainer.workoutPlans[i]._id);
    }

    for (let i = 0; i < trainer.products.length; i++) {
      await ProductModel.findByIdAndDelete(trainer.products[i]._id);
    }

    await TrainerModel.findByIdAndDelete(id);
  },
};

export default TrainerService;
