import { Router } from "express";
import { ScheduleAssignmentController } from "./assignment.controller";
import ScheduleAssignmentValidation from "./assignment.validation";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLES } from "../../../enums";
import auth from "../../middlewares/auth";

const router = Router();

router.get(
    "/",
    auth(USER_ROLES.STUDENT, USER_ROLES.EMPLOYEE, USER_ROLES.DRIVER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ScheduleAssignmentController.getAll
);


router.post(
    "/",
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(ScheduleAssignmentValidation.create),
    ScheduleAssignmentController.create
);

router.get(
    "/driver/:driverId",
    auth(USER_ROLES.DRIVER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ScheduleAssignmentController.getByDriver
);

router.put(
    "/:id",
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(ScheduleAssignmentValidation.update),
    ScheduleAssignmentController.update
);

router.delete(
    "/:id",
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ScheduleAssignmentController.remove
);


export default router;
