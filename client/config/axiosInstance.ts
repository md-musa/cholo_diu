import axios from 'axios';
import { removeAccessToken, setAccessToken, AuthUtil } from '@/utils/authUtil';
import { router } from 'expo-router';
import { ToastUtil } from '@/utils/toastUtil';
import { getConfig } from '@/utils/configStore';

const refreshAccessToken = async () => {
  try {
    const config = getConfig();
    if (!config) return null;

    const response = await axios.post(`${config.api_url}/auth/refresh-token`, {}, { withCredentials: true });
    const newToken = response.data?.data?.accessToken;
    if (newToken) {
      await setAccessToken(newToken);
      return newToken;
    }
  } catch (err) {
    throw err;
  }
};

// ❌ Logout and redirect helper
const forceLogout = async () => {
  await removeAccessToken();
  ToastUtil.error('Session Expired, Please login again');
  router.replace('/login');
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
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setupApiBaseUrl(baseUrl: string) {
  apiClient.defaults.baseURL = `${baseUrl}/api/v1`;
  // console.log('API Base URL set to:', baseUrl);
}

// 🧾 Attach token to request
apiClient.interceptors.request.use(
  async config => {
    const token = (await AuthUtil.getAccessToken()) || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 🚦 Response interceptor
apiClient.interceptors.response.use(
  res => res.data,
  async error => {
    const status = error.response?.status;
    const message = error.response?.data?.errorMessages?.[0]?.message;

    //console.error(`🟥 ${error.config?.url}\n`, JSON.stringify(error.response?.data, null, 2));

    if (status === 401 && message === 'INVALID_ACCESS_TOKEN') {
      return handle401Retry(error);
    }

    ToastUtil.error(message || 'Check you internet connection or server is down or something went wrong!');

    return Promise.reject(error);
  }
);

export default apiClient;
