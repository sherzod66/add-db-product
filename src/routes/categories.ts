import { Router } from "express";
import { CategoryController } from "./../controllers";
import { validate, validateIdParam } from "./../middlewares/validate";
import {
  categoryValidationSchema,
  updateCategoryParentValidationSchema,
  updateCategoryChildrenValidationSchema,
} from "./../validation/schemas/category";

const controller = new CategoryController();

const router = Router();

router.get("/", controller.find);

router.get("/get-parent-cateogries", controller.getParentCategories);

router.post("/", controller.create);

router.get("/:id", validateIdParam, controller.findById);

router.put(
  "/:id",
  validateIdParam,
  validate(categoryValidationSchema),
  controller.update
);

router.put(
  "/update-parent/:id",
  validateIdParam,
  validate(updateCategoryParentValidationSchema),
  controller.updateParent
);

router.put(
  "/update-children/:id",
  validateIdParam,
  validate(updateCategoryChildrenValidationSchema),
  controller.updateChildren
);

router.delete("/:id", validateIdParam, controller.delete);

export default router;
