import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        setUserData(parsedAuth);
      }
    } catch (err) {
      console.error("Error loading session:", err);
      toast.error("Failed to load your session.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to handle successful login/registration
  const handleAuthSuccess = (user, accessToken, redirectPath = "/schedules") => {
    const { _id, name, email, role } = user;
    const authPayload = { userId: _id, name, email, role, accessToken };

    localStorage.setItem("auth", JSON.stringify(authPayload));
    setUserData(authPayload);
    toast.success(`Welcome ${name}!`);
    navigate(redirectPath, { replace: true });
  };

  // Registration
  const registration = async (data) => {
    try {
      setLoading(true);
      const { data: result } = await registerUser(data);
      handleAuthSuccess(result.data.user, result.data.accessToken);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (data) => {
    try {
      setLoading(true);
      const { data: result } = await loginUser(data);
      console.log("Login result:", result);
      handleAuthSuccess(result.user, result.accessToken);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.response?.data?.errorMessages?.[0]?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    try {
      localStorage.removeItem("auth");
      setUserData(null);
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        isAuthenticated: !!userData?.accessToken,
        authLoading: loading,
        login,
        registration,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
