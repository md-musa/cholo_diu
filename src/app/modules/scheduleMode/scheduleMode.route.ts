import express from "express";
import { ScheduleModeController } from "./scheduleMode.controller";

const router = express.Router();

router.get("/", ScheduleModeController.getScheduleMode);
router.put("/", ScheduleModeController.updateScheduleMode);

export const ScheduleModeRouter = router;
