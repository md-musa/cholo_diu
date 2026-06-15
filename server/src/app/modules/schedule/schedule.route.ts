import express from "express";
import { ScheduleController } from "./schedule.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ScheduleValidation } from "./schedule.validation";
import { USER_ROLES } from "../../../enums";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/route/:routeId",
  auth(USER_ROLES.STUDENT, USER_ROLES.EMPLOYEE, USER_ROLES.DRIVER),
  ScheduleController.getScheduleByRoute
);

router.get(
  "/admin/route/:routeId/:mode",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ScheduleController.getScheduleForAdminByRoute
);

router.post(
  "/",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ScheduleValidation.create),
  ScheduleController.createSchedule
);

router.put(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ScheduleValidation.update),
  ScheduleController.updateSchedule
);

router.delete(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ScheduleController.deleteSchedule
);

export const ScheduleRouter = router;
