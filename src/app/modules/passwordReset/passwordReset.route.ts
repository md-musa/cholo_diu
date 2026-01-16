import express from "express";
import {
    sendOtpController,
    verifyOtpController,
    resetPasswordController
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/forgot-password", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);

export default router;
