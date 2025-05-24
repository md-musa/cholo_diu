import apiClient from "../config/axiosInstance";
import { Alert } from "react-native";

interface RegisterUserData {
  email: string;
  password: string;
  name: string;
  phone: string;
  [key: string]: any;
}

interface LoginUserData {
  email: string;
  password: string;
}

const AuthService = {
  registerUser: async (data: any) => apiClient.post("/auth/register", data),
  loginUser: async (data: LoginUserData) => apiClient.post("/auth/login", data),
};

export default AuthService;
