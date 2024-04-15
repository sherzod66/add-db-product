import { Router } from "express";
import { WorkoutPlanController } from "./../controllers";
import { validate, validateIdParam } from "./../middlewares/validate";
import { createWorkoutPlanValidationSchema } from "./../validation/schemas/workout";

const controller = new WorkoutPlanController();

const router = Router();

router.get("/", controller.find);

router.post(
  "/",
  validate(createWorkoutPlanValidationSchema),
  controller.create
);

router.get("/:id", validateIdParam, controller.findOne);

router.put("/:id", validateIdParam, controller.update);

router.delete("/:id", validateIdParam, controller.delete);

export default router;
