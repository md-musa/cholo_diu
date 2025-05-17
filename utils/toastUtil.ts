import Toast from "react-native-toast-message";

interface ShowToastProps {
  type?: "success" | "error" | "info";
  text1?: string;
  text2?: string;
  position?: "top" | "bottom";
}

export const showToast = ({ type = "success", text1 = "", text2 = "", position = "top" }: ShowToastProps): void => {
  Toast.show({
    type,
    text1,
    text2,
    position,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
    bottomOffset: 40,
    props: {
      text1Style: { fontSize: 18, fontWeight: "bold" },
      text2Style: { fontSize: 16 },
    },
  });
};
