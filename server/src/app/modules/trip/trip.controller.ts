import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { ITrip } from "./trip.interface";
import { DriverTripService, UserTripService } from "./trip.service";
import { Request, Response } from "express";
import ApiError from "../../../errors/ApiError";

export const DriverTripController = {
  create: async (req: Request, res: Response) => {
    const tripData: ITrip = req.body;
    const trip = await DriverTripService.create(tripData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Trip created successfully",
      data: trip,
    });
  },

  getById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const trip = await DriverTripService.getById(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Trip retrieved successfully",
      data: trip,
    });
  },

  getAll: async (req: Request, res: Response) => {
    const trips = await DriverTripService.getAll();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Trips retrieved successfully",
      data: trips,
    });
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload: Partial<ITrip> = req.body;
    if (!payload.status) throw ApiError.badRequest("Status is required");

    const trip = await DriverTripService.update(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Trip updated successfully",
      data: trip,
    });
  },

  delete: async (req: Request, res: Response) => {
    const { id } = req.params;
    const trip = await DriverTripService.delete(id);

    sendResponse(res, {
      success: true,
      statusCode: trip ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: trip ? "Trip deleted successfully" : "Trip not found",
      data: trip || null,
    });
  },
};

export const UserTripController = {
  create: async (req: Request, res: Response) => {
    const tripData = req.body;
    const trip = await UserTripService.create(tripData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Trip created successfully",
      data: trip,
    });
  },
};
