import axios from "axios";
import { showToast } from "@/utils/toastUtil";
import { logoutUser, getAccessToken, setAccessToken } from "@/utils/authUtil";
import { router } from "expo-router";

const SERVER_URL = "http://192.168.1.15:4000/api/v1";
// const SERVER_URL = `https://tms-dcro.onrender.com/api/v1`;
// const SERVER_URL = "https://choloserver-production.up.railway.app/api/v1";

// 🔁 Refresh token helper
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${SERVER_URL}/auth/refresh-token`, {}, { withCredentials: true });
    const newToken = response.data?.data?.accessToken;
    if (newToken) {
      await setAccessToken(newToken);
      return newToken;
    }
  } catch (err) {
    console.error("🔁 Refresh token failed:", JSON.stringify(err, null, 2));
    throw err;
  }
};

// ❌ Logout and redirect helper
const forceLogout = async () => {
  await logoutUser();
  showToast({ type: "error", text1: "Session Expired", text2: "Please log in again." });
  router.replace("/login");
};

// 🔄 Retry handler for 401 errors
const handle401Retry = async (error: any) => {
  const originalRequest = error.config;
  originalRequest._retryCount = originalRequest._retryCount || 0;

  if (originalRequest._retryCount >= 2) {
    await forceLogout();
    return Promise.reject(error);
  }

  originalRequest._retryCount++;

  try {
    const newToken = await refreshAccessToken();
    if (newToken) {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    }
  } catch (refreshError) {
    await forceLogout();
    return Promise.reject(refreshError);
  }
};

// 🌐 Axios Instance
const apiClient = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧾 Attach token to request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚦 Response interceptor
apiClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.errorMessages?.[0]?.message;

    console.error(`🟥 ${error.config?.url}\n`, JSON.stringify(error.response?.data, null, 2));

    if (status === 401 && message === "INVALID_ACCESS_TOKEN") {
      return handle401Retry(error);
    }

    showToast({
      type: "error",
      text1: "API Error",
      text2: message || "Something went wrong!",
    });

    return Promise.reject(error);
  }
);

export default apiClient;
