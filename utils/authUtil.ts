import { store } from "@/store/storeConfig";
import { showToast } from "./toastUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_STORAGE_KEYS } from "@/constants";

interface RegistrationFormData {
  name: string;
  routeId: string;
  role: string;
  email: string;
  password: string;
}

const validateRegistrationForm = (formData: RegistrationFormData): boolean => {
  const { name, routeId, role, email, password } = formData;

  if (!name.trim()) {
    showToast({
      type: "error",
      text1: "Name Required",
      text2: "Please enter your full name",
    });
    return false;
  }

  if (!routeId) {
    showToast({
      type: "error",
      text1: "Route Required",
      text2: "Please select your bus route",
    });
    return false;
  }

  if (!role) {
    showToast({
      type: "error",
      text1: "Role Required",
      text2: "Please select your role",
    });
    return false;
  }

  if (!email.trim()) {
    showToast({
      type: "error",
      text1: "Email Required",
      text2: "Please enter your email address",
    });
    return false;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showToast({
      type: "error",
      text1: "Invalid Email",
      text2: "Please enter a valid email address",
    });
    return false;
  }

  if (!password || password.length < 6) {
    showToast({
      type: "error",
      text1: "Password Required",
      text2: "Password must be at least 6 characters",
    });
    return false;
  }

  return true;
};

export const getAccessToken = async () => {
  // const state = store.getState();
  // if (state.auth?.accessToken) return state.auth.accessToken;
  return await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
};

export const setAccessToken = async (token: string) => {
  return await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, token);
};

export const removeAccessToken = async () => {
  await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
};

export const AuthUtil = {
  validateRegistrationForm,
  getAccessToken,
  setAccessToken,
  removeAccessToken,
};
