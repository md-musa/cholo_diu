import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { DriverTripController, UserTripController } from "./trip.controller";
import { TripValidation } from "./trip.validation";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums";

const router = express.Router();

// Driver create trip and update trip
router.post(
  "/",
  validateRequest(TripValidation.create),
  auth(USER_ROLES.DRIVER),
  DriverTripController.create
);

router.put(
  "/:id",
  validateRequest(TripValidation.update),
  auth(USER_ROLES.DRIVER),
  DriverTripController.update
);

router.get(
  "/:id",
  auth(USER_ROLES.DRIVER),
  DriverTripController.getById
);
router.get(
  "/",
  auth(USER_ROLES.DRIVER),
  DriverTripController.getAll
);
router.delete(
  "/:id",
  auth(USER_ROLES.DRIVER),
  DriverTripController.delete
);


// User create trip
router.post(
  "/userTrip",
  validateRequest(TripValidation.userTripCreate),
  auth(USER_ROLES.STUDENT, USER_ROLES.EMPLOYEE),
  UserTripController.create
);

export const TripRouter = router;
