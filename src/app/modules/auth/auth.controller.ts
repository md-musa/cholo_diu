import { Request, Response } from "express";
import { IUser } from "./auth.interface";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  const userInfo: IUser = req.body;

  const { accessToken, refreshToken, user } = await AuthService.registerUser(userInfo);
  res.cookie("refreshToken", refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: { accessToken, user },
  });
};

const login = async (req: Request, res: Response): Promise<void> => {
  const userInfo: IUser = req.body;

  const { accessToken, refreshToken, user } = await AuthService.login(userInfo);
  res.cookie("refreshToken", refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: { accessToken, user },
  });
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;
  const { accessToken, newRefreshToken } = await AuthService.refreshToken(refreshToken);
  res.cookie("refreshToken", newRefreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "New access token generated successfully",
    data: { accessToken },
  });
};

const getSingleUserData = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;
  const user = await AuthService.getSingleUserData(userId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User fatched in successfully",
    data: user,
  });
};

const getAllDrivers = async (req: Request, res: Response): Promise<void> => {
  const user = await AuthService.getAllDrivers();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User fatched in successfully",
    data: user,
  });
};

const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await AuthService.deleteUserById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User account deleted successfully",
    data: user,
  });
};


const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  await AuthService.sendOtp(email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP sent successfully",
    data: { email },
  });
};

const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyOtp(email, otp);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP verified successfully",
    data: result,
  });
};

const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  console.log(req.body);
  await AuthService.resetPassword(email, newPassword);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password reset successfully",
    data: { email },
  });
};



export const AuthController = {
  registerUser,
  login,
  refreshToken,
  getSingleUserData,
  getAllDrivers,
  deleteUserById,
  sendOtp,
  verifyOtp,
  resetPassword,
};
