import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { ScheduleModeService } from "./scheduleMode.service";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiError";

const getScheduleMode = async (req: Request, res: Response) => {
  const result = await ScheduleModeService.getCurrentScheduleMode();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule mode retrieved successfully",
    data: result,
  });
};

const updateScheduleMode = async (req: Request, res: Response) => {
  const { modeKey } = req.body;

  if (!modeKey) throw ApiError.badRequest("modeKey is required");

  const result = await ScheduleModeService.updateCurrentScheduleMode(modeKey);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule mode updated successfully",
    data: result,
  });
};

export const ScheduleModeController = {
  updateScheduleMode,
  getScheduleMode,
};
