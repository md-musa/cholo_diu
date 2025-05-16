import axios from "axios";


// const SERVER_URL = "http://192.168.1.3:4000/api/v1";
const SERVER_URL = `https://tms-dcro.onrender.com/api/v1`;

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
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
