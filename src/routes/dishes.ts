import { Router } from "express";
import { DishController } from "./../controllers";
import { dishValidationSchema } from "./../validation/schemas/dish";
import { validate, validateIdParam } from "./../middlewares/validate";

const router = Router();

const controller = new DishController();

router.get("/", controller.find);

router.post("/", validate(dishValidationSchema), controller.create);

router.get("/:id", validateIdParam, controller.findById);

router.put(
  "/:id",
  validateIdParam,
  validate(dishValidationSchema),
  controller.update
);

router.delete("/:id", validateIdParam, controller.delete);

export default router;
