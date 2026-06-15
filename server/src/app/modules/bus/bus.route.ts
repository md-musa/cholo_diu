import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BusValidation } from "./bus.validation";
import { BusController } from "./bus.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums";

const router = express.Router();

router.get("/",
  auth(USER_ROLES.STUDENT, USER_ROLES.EMPLOYEE, USER_ROLES.DRIVER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BusController.getBuses);

router.post(
  "/",
  validateRequest(BusValidation.create),
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BusController.createBus
);

router.put(
  "/:id",
  validateRequest(BusValidation.update),
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BusController.updateBus
);

router.delete("/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BusController.deleteBus
);

export const BusRouter = router;
