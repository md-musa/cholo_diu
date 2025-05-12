import React, { createContext, useState, useContext, useEffect } from "react";
import SecureStorage from "@/utils/asyncStorage";
import { loginUser, registerUser } from "@/services/authService";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Prevent splash screen from hiding automatically
  // SplashScreen.preventAutoHideAsync();

  // Load user data on initial render
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const [auth, route] = await Promise.all([SecureStorage.getItem("auth-1"), SecureStorage.getItem("route")]);

        if (auth) {
          const parsedAuth = JSON.parse(auth);
          const parsedRoute = route ? JSON.parse(route) : null;

          setUserData({
            ...parsedAuth,
            route: parsedRoute,
          });

          // Only redirect if we have essential auth data
          if (parsedAuth.accessToken) {
            router.replace("/home");
          }
        }
      } catch (err) {
        console.error("Error retrieving auth data:", err);
        Toast.show({
          type: "error",
          text1: "Session Error",
          text2: "Failed to load your session",
        });
      } finally {
        setLoading(false);
        setAuthInitialized(true);
        // Hide splash screen when auth state is initialized
        await SplashScreen.hideAsync();
      }
    };

    loadUserData();
  }, []);

  const updateRoute = async (routeData) => {
    try {
      setLoading(true);
      await SecureStorage.setItem("route", JSON.stringify(routeData));
      setUserData((prev) => ({ ...prev, route: routeData }));
      Toast.show({
        type: "success",
        text1: "Route Updated",
        text2: "Your bus route has been updated",
      });
    } catch (err) {
      console.error("Update Route Error:", err);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Failed to update your route",
      });
    } finally {
      setLoading(false);
    }
  };

  const registration = async (data) => {
    try {
      setLoading(true);
      const result = await registerUser(data);

      const { accessToken, user } = result.data.data;
      const { _id, name, email, role, routeId } = user;

      await Promise.all([
        SecureStorage.setItem(
          "auth-1",
          JSON.stringify({
            userId: _id,
            accessToken,
            name,
            email,
            role,
          })
        ),
        SecureStorage.setItem("route", JSON.stringify({ route: routeId })),
      ]);

      setUserData({ userId: _id, accessToken, name, email, role, route: routeId });

      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: `Welcome ${name}!`,
      });

      router.replace("/home");
    } catch (err) {
      console.error("Registration Error:", err);
      const errorMessage = err.message || "Registration failed. Please try again.";
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      setLoading(true);
      const result = await loginUser(data);

      const { accessToken, user } = result.data.data;
      const { _id, name, email, role, routeId } = user;

      await Promise.all([
        SecureStorage.setItem(
          "auth-1",
          JSON.stringify({
            userId: _id,
            accessToken,
            name,
            email,
            role,
          })
        ),
        SecureStorage.setItem("route", JSON.stringify({ route: routeId })),
      ]);

      setUserData({ userId: _id, accessToken, name, email, role, route: routeId });

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${name}!`,
      });

      router.replace("/home");
    } catch (err) {
      const errorMessage = err.message || "Invalid credentials. Please try again.";
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await Promise.all([SecureStorage.deleteItem("auth-1"), SecureStorage.deleteItem("route")]);

      setUserData(null); // ✔ clears auth context

      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });

      router.replace("/"); // ✔ navigate back to root
    } catch (err) {
      console.error("Logout Error:", err);
      Toast.show({
        type: "error",
        text1: "Logout Error",
        text2: "Failed to logout properly",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        login,
        registration,
        logout,
        updateRoute,
        authLoading: loading,
        isAuthenticated: !!userData?.accessToken,
        authInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
