import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import { Easing } from "react-native-reanimated";

const DEFAULT_CONFIG = {
  duration: 3000,
  position: ToastPosition.BOTTOM_RIGHT,
  // icon: "👏",
  animationConfig: {
    duration: 500,
    flingPositionReturnDuration: 200,
    easing: Easing.elastic(1),
  },
};

const showToast = (msg: string) => {
  toast(msg, DEFAULT_CONFIG);
};

const showSuccess = (msg: string) => {
  toast.success(msg, DEFAULT_CONFIG);
};

const showError = (msg: string) => {
  toast.error(msg, DEFAULT_CONFIG);
};

const showLoading = (msg: string) => {
  return toast.loading(msg, { ...DEFAULT_CONFIG, duration: Infinity });
};

const updateLoading = (id: string, successMsg: string) => {
  toast.success(successMsg, { ...DEFAULT_CONFIG, id });
};

const dismissToast = (id?: string) => {
  id ? toast.dismiss(id) : toast.dismiss();
};

export const ToastUtil = {
  toast: showToast,
  success: showSuccess,
  error: showError,
  loading: showLoading,
  updateLoading: updateLoading,
  dismiss: dismissToast,
};

// interface ShowToastProps {
//   type?: "success" | "error" | "info";
//   text1?: string;
//   text2?: string;
//   position?: "top" | "bottom";
// }

// export const showToast = ({ type = "success", text1 = "", text2 = "", position = "top" }: ShowToastProps): void => {
//   Toast.show({
//     type,
//     text1,
//     text2,
//     position,
//     visibilityTime: 3000,
//     autoHide: true,
//     topOffset: 50,
//     bottomOffset: 40,
//     props: {
//       text1Style: { fontSize: 21, fontWeight: "bold" },
//       text2Style: { fontSize: 20 },
//     },
//   });
// };
