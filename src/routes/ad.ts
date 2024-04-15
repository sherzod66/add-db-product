import { AdController } from "../controllers/AdController";
import { Router } from "express";
import { validate, validateIdParam } from "../middlewares/validate";
import { adValidation } from "../validation/schemas/ad";

const router = Router();

const controller = new AdController();

router.get("/", controller.find);

router.post("/", validate(adValidation), controller.create);

router.delete("/:id", validateIdParam, controller.delete);

export default router;
