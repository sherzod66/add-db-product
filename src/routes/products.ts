import { Router } from "express";
import { ProductController } from "../controllers";
import { validate, validateIdParam } from "../middlewares/validate";
import {
  createProductValidationSchema,
  updateProductCategoryValidationSchema,
  updateProductValidationSchema,
} from "../validation/schemas/product";

const controller = new ProductController();

const router = Router();

router.get("/", controller.find);

router.post("/", validate(createProductValidationSchema), controller.create);

router.get("/:id", validateIdParam, controller.findOne);

router.put(
  "/:id",
  validateIdParam,
  validate(updateProductValidationSchema),
  controller.update
);

router.put(
  "/update-category/:id",
  validateIdParam,
  validate(updateProductCategoryValidationSchema),
  controller.updateCategory
);

router.delete("/:id", validateIdParam, controller.delete);

export default router;
