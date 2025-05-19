import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import SecureStorage from "@/utils/asyncStorage";
import { loginUser, registerUser } from "@/services/authService";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { showToast } from "@/utils/toastUtil";
import { RouteService } from "@/services/routeService";
import { STUDENT_DENSITY, USER_ROLES } from "@/constants";
import { IRoute, IUser } from "@/interfaces/route";

// ==================== INTERFACES ====================

export interface IAuthData {
  userId: string;
  accessToken: string;
  name: string;
  email: string;
  role: USER_ROLES;
  route?: IRoute;
}

interface IAuthContext {
  userData: IAuthData | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  authInitialized: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  registration: (data: IUser) => Promise<void>;
  logout: () => Promise<void>;
  updateRoute: (routeData: IRoute) => Promise<void>;
}

// ==================== CONTEXT ====================
const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// ==================== HELPER FUNCTIONS ====================
const storeAuthData = async (data: Partial<IAuthData>, routeData?: IRoute) => {
  await Promise.all([
    SecureStorage.setItem("auth-1", JSON.stringify(data)),
    routeData && SecureStorage.setItem("route", JSON.stringify(routeData)),
  ]);
};

const clearAuthData = async () => {
  await Promise.all([SecureStorage.deleteItem("auth-1"), SecureStorage.deleteItem("route")]);
};

// ==================== PROVIDER ====================
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<IAuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const [auth, route] = await Promise.all([SecureStorage.getItem("auth-1"), SecureStorage.getItem("route")]);

        if (auth) {
          const parsedAuth = JSON.parse(auth) as IAuthData;
          const parsedRoute = route ? (JSON.parse(route) as IRoute) : undefined;

          setUserData({
            ...parsedAuth,
            route: parsedRoute,
          });

          if (parsedAuth.accessToken) {
            router.replace("/home");
          }
        }
      } catch (err) {
        // console.error("Auth initialization error:", err);
        showToast({
          type: "error",
          text1: "Session Error",
          text2: "Failed to load your session",
        });
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    const fetchRoutes = async () => {
      try {
        const res = await RouteService.getRoutes();
      } catch (err) {
        // console.error("Route fetch error:", err);
      }
    };

    Promise.all([initializeAuth(), fetchRoutes()]).finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  const updateRoute = async (routeData: IRoute) => {
    try {
      setLoading(true);
      await SecureStorage.setItem("route", JSON.stringify(routeData));
      setUserData((prev) => (prev ? { ...prev, route: routeData } : null));
    } catch (err) {
      // console.error("Route update error:", err);
      showToast({
        type: "error",
        text1: "Update Failed",
        text2: "Failed to update route",
      });
    } finally {
      setLoading(false);
    }
  };

  const registration = async (data: Omit<IUser, "_id">) => {
    try {
      setLoading(true);
      const result = await registerUser(data);
      const { accessToken, user } = result.data.data;
      const { _id, name, email, role, routeId } = user;

      await storeAuthData({ userId: _id, accessToken, name, email, role }, routeId);

      setUserData({ userId: _id, accessToken, name, email, role, route: routeId });

      showToast({
        type: "success",
        text1: "Registration Successful",
        text2: `Welcome ${name}!`,
      });

      router.replace("/home");
    } catch (err) {
      // console.error("Registration error:", err);
      showToast({
        type: "error",
        text1: "Registration Failed",
        text2: err.response?.data?.errorMessage[0].message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    try {
      setLoading(true);
      const result = await loginUser(data);
      console.log("🟢 Result: ----\n", JSON.stringify(result, null, 2));
      const { accessToken, user } = result.data.data;
      const { _id, name, email, role, routeId } = user;

      await storeAuthData({ userId: _id, accessToken, name, email, role }, routeId);

      setUserData({ userId: _id, accessToken, name, email, role, route: routeId });

      showToast({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${name}!`,
      });

      router.replace("/home");
    } catch (err) {
      // // console.error("Login error:🔴---------\n", JSON.stringify(err.response?.data?.errorMessage[0].message, null, 2));
      showToast({
        type: "error",
        text1: "Login Failed",
        text2: err.response?.data?.errorMessage[0].message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await clearAuthData();
      setUserData(null);

      showToast({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });

      router.replace("/");
    } catch (err) {
      // console.error("Logout error:", err);
      showToast({
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

// ==================== HOOK ====================
export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// import React, { createContext, useState, useContext, useEffect } from "react";
// import SecureStorage from "@/utils/asyncStorage";
// import { loginUser, registerUser } from "@/services/authService";
// import { useRouter } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { showToast } from "@/utils/toastUtil";
// import { RouteService } from "@/services/routeService";
// import { STUDENT_DENSITY, USER_ROLES } from "@/constants";

// export interface IRoute {
//   name: string;
//   startLocation: string;
//   endLocation: string;
//   totalDistance?: number; // in kilometers
//   estimatedTime?: number; // in minutes
//   wayline?: JSON; // matches Mongoose Mixed
//   assignedBuses?: string[]; // array of ObjectIds as strings
//   waypoints?: {
//     location?: string;
//     latitude?: number;
//     longitude?: number;
//     studentDensity?: STUDENT_DENSITY.LOW | STUDENT_DENSITY.MEDIUM | STUDENT_DENSITY.HIGH;
//   }[];
// }
// export interface IUser {
//   name: string;
//   email: string;
//   role: USER_ROLES.ADMIN | USER_ROLES.EMPLOYEE | USER_ROLES.STUDENT | USER_ROLES.SUPER_ADMIN;
//   password: string;
//   phoneNumber: string;
//   houseLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   routeId: IRoute;
// }

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const router = useRouter();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authInitialized, setAuthInitialized] = useState(false);
//   const [availRoutes, setAvailRoutes] = useState([]);

//   // Load user data on initial render
//   useEffect(() => {
//     // --- Restart server ------- remove this function later
//     const fetchRoutes = async () => {
//       try {
//         const res = await RouteService.getRoutes();
//         setAvailRoutes(res.data.data);
//       } catch (err) {
//         // console.error("API Error:", err.message);
//       } finally {
//         await SplashScreen.hideAsync();
//       }
//     };

//     const loadUserData = async () => {
//       try {
//         setLoading(true);
//         const [auth, route] = await Promise.all([SecureStorage.getItem("auth-1"), SecureStorage.getItem("route")]);

//         if (auth) {
//           const parsedAuth = JSON.parse(auth);
//           const parsedRoute = route ? JSON.parse(route) : null;

//           setUserData({
//             ...parsedAuth,
//             route: parsedRoute,
//           });

//           // Only redirect if we have essential auth data
//           if (parsedAuth.accessToken) {
//             router.replace("/home");
//           }
//         }
//       } catch (err) {
//         // console.error("Error retrieving auth data:", err);
//         showToast({
//           type: "error",
//           text1: "Session Error",
//           text2: "Failed to load your session",
//         });
//       } finally {
//         setLoading(false);
//         setAuthInitialized(true);
//         // Hide splash screen when auth state is initialized
//         // await SplashScreen.hideAsync();
//       }
//     };

//     fetchRoutes();
//     loadUserData();
//   }, []);

//   const updateRoute = async (routeData) => {
//     try {
//       setLoading(true);
//       await SecureStorage.setItem("route", JSON.stringify(routeData));
//       setUserData((prev) => ({ ...prev, route: routeData }));
//     } catch (err) {
//       // console.error("Update Route Error:", err);
//       showToast({
//         type: "error",
//         text1: "Update Failed",
//         text2: "Failed to update your route",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const registration = async (data) => {
//     try {
//       setLoading(true);
//       const result = await registerUser(data);

//       const { accessToken, user } = result.data.data;
//       const { _id, name, email, role, routeId } = user;

//       await Promise.all([
//         SecureStorage.setItem(
//           "auth-1",
//           JSON.stringify({
//             userId: _id,
//             accessToken,
//             name,
//             email,
//             role,
//           })
//         ),
//         SecureStorage.setItem("route", JSON.stringify({ route: routeId })),
//       ]);

//       setUserData({ userId: _id, accessToken, name, email, role, route: routeId });

//       showToast({
//         type: "success",
//         text1: "Registration Successful",
//         text2: `Welcome ${name}!`,
//       });

//       router.replace("/home");
//     } catch (err) {
//       // console.error("Registration Error:", err);
//       const errorMessage = err.message || "Registration failed. Please try again.";
//       showToast({
//         type: "error",
//         text1: "Registration Failed",
//         text2: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (data) => {
//     try {
//       setLoading(true);
//       const result = await loginUser(data);

//       const { accessToken, user } = result.data.data;
//       const { _id, name, email, role, routeId } = user;

//       await Promise.all([
//         SecureStorage.setItem(
//           "auth-1",
//           JSON.stringify({
//             userId: _id,
//             accessToken,
//             name,
//             email,
//             role,
//           })
//         ),
//         SecureStorage.setItem("route", JSON.stringify({ route: routeId })),
//       ]);

//       setUserData({ userId: _id, accessToken, name, email, role, route: routeId });

//       showToast({
//         type: "success",
//         text1: "Login Successful",
//         text2: `Welcome back, ${name}!`,
//       });

//       router.replace("/home");
//     } catch (err) {
//       const errorMessage = err.message || "Invalid credentials. Please try again.";
//       showToast({
//         type: "error",
//         text1: "Login Failed",
//         text2: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setLoading(true);
//       await Promise.all([SecureStorage.deleteItem("auth-1"), SecureStorage.deleteItem("route")]);

//       setUserData(null); // ✔ clears auth context

//       showToast({
//         type: "success",
//         text1: "Logged Out",
//         text2: "You have been successfully logged out",
//       });

//       router.replace("/"); // ✔ navigate back to root
//     } catch (err) {
//       // console.error("Logout Error:", err);
//       showToast({
//         type: "error",
//         text1: "Logout Error",
//         text2: "Failed to logout properly",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         userData,
//         login,
//         registration,
//         logout,
//         updateRoute,
//         authLoading: loading,
//         isAuthenticated: !!userData?.accessToken,
//         authInitialized,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
