import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { jwtDecode } from "jwt-decode";
import { showToast } from "@/utils/toastUtil";
import { USER_ROLES } from "@/constants";
import { IRoute, IUser } from "@/interfaces/route";
import AuthService from "@/services/authService";

interface DecodedToken {
  _id: string;
  role: USER_ROLES;
  email: string;
}

interface AuthUserData {
  _id: string;
  role: USER_ROLES;
  email: string;
}

interface IAuthContext {
  userData: AuthUserData | null;
  routeData: IRoute | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  authInitialized: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: IUser) => Promise<void>;
  logout: () => Promise<void>;
  updateRoute: (routeData: IRoute) => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<AuthUserData | null>(null);
  const [routeData, setRouteData] = useState<IRoute | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  console.log("🟢 User", JSON.stringify(userData, null, 2));
  console.log("🟢 Route", JSON.stringify(routeData, null, 2));

  // Save session data to storage and state
  const saveSession = useCallback(async (token: string, route: IRoute) => {
    try {
      await AsyncStorage.setItem("auth-token", token);
      if (route) {
        await AsyncStorage.setItem("route-data", JSON.stringify(route));
      }

      // Decode token to get user data
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("✅Decoded token:", JSON.stringify(decoded, null, 2));

      const userData: AuthUserData = {
        _id: decoded._id,
        role: decoded.role,
        email: decoded.email,
      };

      // Update state
      setUserData(userData);
      if (route) {
        setRouteData(route);
      }
    } catch (error) {
      console.error("Failed to save session:", error);
      throw error;
    }
  }, []);

  // Clear all auth data
  const clearSession = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("auth-token");
      await AsyncStorage.removeItem("route-data");
      setUserData(null);
      setRouteData(null);
    } catch (error) {
      console.error("Failed to clear session:", error);
      throw error;
    }
  }, []);

  // Initialize auth state from storage
  const initializeAuth = useCallback(async () => {
    try {
      setAuthLoading(true);
      const token = await AsyncStorage.getItem("auth-token");
      const routeJson = await AsyncStorage.getItem("route-data");

      if (!token) {
        router.replace("/");
        return;
      }

      // Decode token to get user data
      const decoded = jwtDecode<DecodedToken>(token);
      const userData: AuthUserData = {
        _id: decoded._id,
        role: decoded.role,
        email: decoded.email,
      };

      // Update state
      setUserData(userData);

      if (routeJson) {
        const route = JSON.parse(routeJson) as IRoute;
        setRouteData(route);
      }

      router.replace("/home");
    } catch (error) {
      console.error("Auth initialization error:", error);
      await clearSession();
      router.replace("/login");
    } finally {
      setAuthLoading(false);
      setAuthInitialized(true);
      await SplashScreen.hideAsync();
    }
  }, [clearSession, router]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setAuthLoading(true);
      const res = await AuthService.loginUser(credentials);
      console.log("Login credentials:", JSON.stringify(res.data));
      const { accessToken, user } = res.data;

      await saveSession(accessToken, user.routeId);

      showToast({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${res.data.user.name}!`,
      });

      router.replace("/home");
    } catch (error: any) {
      console.error("Login error:", error);
      showToast({
        type: "error",
        text1: "Login Failed",
        text2: error?.response?.data?.errorMessage[0]?.message || "Invalid credentials",
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData: IUser) => {
    try {
      setAuthLoading(true);
      const res = await AuthService.registerUser(userData);
      const { accessToken, user } = res.data;
      await saveSession(accessToken, user.routeId);

      showToast({
        type: "success",
        text1: "Registration Successful",
        text2: `Welcome ${res.data.user.name}!`,
      });

      router.replace("/home");
    } catch (error: any) {
      showToast({
        type: "error",
        text1: "Registration Failed",
        text2: error?.response?.data?.errorMessage[0]?.message || "Registration failed",
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);
      await clearSession();
      showToast({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast({
        type: "error",
        text1: "Logout Error",
        text2: "Failed to logout properly",
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const updateRoute = async (route: IRoute) => {
    try {
      setAuthLoading(true);
      await AsyncStorage.setItem("route-data", JSON.stringify(route));
      setRouteData(route);
    } catch (error) {
      console.error("Route update error:", error);
      showToast({
        type: "error",
        text1: "Update Failed",
        text2: "Failed to update route",
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const contextValue: IAuthContext = {
    userData,
    routeData,
    authLoading,
    authInitialized,
    isAuthenticated: !!userData,
    login,
    register,
    logout,
    updateRoute,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
