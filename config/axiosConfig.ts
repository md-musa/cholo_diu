import { showToast } from "@/utils/toastUtil";
import axios from "axios";

// const SERVER_URL = "http://192.168.1.9:4000/api/v1";
// const SERVER_URL = `https://tms-dcro.onrender.com/api/v1`;
const SERVER_URL = "https://choloserver-production.up.railway.app/api/v1";

const apiClient = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Optional)
apiClient.interceptors.request.use(
  (config) => {
    // Example: Add Authorization token if needed
    const token = "your_auth_token";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // // console.error("[axios] API Error:", JSON.stringify(error.response?.data?.errorMessages[0].message, null, 2));

    showToast({
      type: "error",
      text1: "API Error",
      text2: error.response?.data?.errorMessages[0].message || "Something went wrong!",
    });
    return Promise.reject(error);
  }
);

export default apiClient;
