import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post("/register", validateRequest(AuthValidation.register), AuthController.registerUser);
router.post("/login", validateRequest(AuthValidation.login), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/user", AuthController.getSingleUserData)
router.get("/drivers", AuthController.getAllDrivers)
router.delete("/delete/:id", AuthController.deleteUserById)

// Password Reset
router.post("/send-otp", validateRequest(AuthValidation.forgotPassword), AuthController.sendOtp);
router.post("/verify-otp", validateRequest(AuthValidation.verifyOtp), AuthController.verifyOtp);
router.post("/reset-password", validateRequest(AuthValidation.resetPassword), AuthController.resetPassword);

export const AuthRouter = router;
