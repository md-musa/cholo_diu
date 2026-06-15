import express from "express";
import { ErrorLogController } from "./errorLog.controller";
import { USER_ROLES } from "../../../enums";
import auth from "../../middlewares/auth";


const router = express.Router();

router.get(
    "/",
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ErrorLogController.getLogs
);

export const ErrorLogRoute = router;
