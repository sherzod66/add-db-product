import { Router } from "express";
import { validate, validateIdParam } from "../middlewares/validate";
import { NutritionPlanController } from "../controllers";
import { createNutritionPlanValidationSchema } from "../validation/schemas/nutrition";

const controller = new NutritionPlanController();

const router = Router();

router.get("/", controller.find);

router.post(
  "/",
  validate(createNutritionPlanValidationSchema),
  controller.create
);

router.get("/:id", validateIdParam, controller.findOne);

router.put("/:id", validateIdParam, controller.update);

router.delete("/:id", validateIdParam, controller.delete);

export default router;
