import express from "express";
import { ScheduleModeController } from "./scheduleMode.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums";

const router = express.Router();

router.get(
    "/",
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ScheduleModeController.getScheduleMode
);


router.put(
    "/",
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ScheduleModeController.updateScheduleMode
);

export const ScheduleModeRouter = router;
