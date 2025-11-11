import { TouchableOpacity, Text, Linking } from "react-native";

export default function ForgotPassword() {
  const handleForgotPassword = () => {
    const email = "mohammad.musa.dev@gmail.com";
    const subject = encodeURIComponent("Password Reset Request (Cholo App)");
    const body = encodeURIComponent(
      `Hello, I forgot my password. Please assist me. My account email is: [Your Email Here]`
    );
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoUrl).catch(() => alert("Unable to open email app."));
  };

  return (
    <TouchableOpacity className="mb-4" onPress={handleForgotPassword}>
      <Text className="text-secondary-700">Forgot Password?</Text>
    </TouchableOpacity>
  );
}
