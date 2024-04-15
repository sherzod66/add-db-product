import { Router } from "express";
import { ExerciseController } from "../controllers";
import { validate, validateIdParam } from "./../middlewares/validate";
import {
  exerciseValidationSchema,
  updateExerciseCategoryValidationSchema,
  updateExerciseValidationSchema,
} from "./../validation/schemas/exercise";

const controller = new ExerciseController();

const router = Router();

router.get("/", controller.find);

router.post("/", validate(exerciseValidationSchema), controller.create);

router.get("/:id", validateIdParam, controller.findOne);

router.put(
  "/:id",
  validateIdParam,
  validate(updateExerciseValidationSchema),
  controller.update
);

router.put(
  "/update-category/:id",
  validateIdParam,
  validate(updateExerciseCategoryValidationSchema),
  controller.updateCategory
);

router.delete("/:id", validateIdParam, controller.delete);

export default router;
