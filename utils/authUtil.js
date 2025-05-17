import { showToast } from "./toastUtil";

const validateRegistrationForm = (formData) => {
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

export const AuthUtil = {
  validateRegistrationForm,
};
