import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true
        },

        otp: {
            type: String,
            required: true,
            select: false
        },

        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 } // TTL index
        }
    },
    { timestamps: true }
);

export const OTPModel = mongoose.model("OTP", otpSchema);
