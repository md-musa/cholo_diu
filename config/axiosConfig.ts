import { showToast } from "@/utils/toastUtil";
import axios from "axios";
import { logoutUser, getAccessToken, setAccessToken } from "@/utils/authUtil";
import { router } from "expo-router";

const SERVER_URL = "http://192.168.1.2:4000/api/v1";
// const SERVER_URL = `https://tms-dcro.onrender.com/api/v1`;
// const SERVER_URL = "https://choloserver-production.up.railway.app/api/v1";

const apiClient = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to each request
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    // print api url
    console.error("🟥 Centralized Error:\n", JSON.stringify(error.message, null, 2));
    console.log("API URL:", error.config.url);
    const originalRequest = error.config;

    // // Initialize _retryCount if not already present
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // Access token expired and retries not exceeded
    if (error?.response?.status === 401 && originalRequest._retryCount < 2) {
      originalRequest._retryCount++;

      try {
        const response = await axios.post(`${SERVER_URL}/auth/refresh-token`, {}, { withCredentials: true });

        const newAccessToken = response.data?.accessToken;
        if (newAccessToken) {
          await setAccessToken(newAccessToken);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token invalid — force logout
        await logoutUser();
        showToast({
          type: "error",
          text1: "Session Expired",
          text2: "Please log in again.",
        });

        router.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    // All other API errors
    console.log(JSON.stringify(error.response.data.errorMessages[0].message, null, 2));
    showToast({
      type: "error",
      text1: "API Error",
      text2: error.response.data.errorMessages[0].message || "Something went wrong!",
    });

    return Promise.reject(error);
  }
);

export default apiClient;
