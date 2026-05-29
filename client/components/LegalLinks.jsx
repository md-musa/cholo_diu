import React from "react";
import { View, Text, Linking, StyleSheet, TouchableOpacity } from "react-native";

const LegalLinks = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        By signing up or logging in, you agree to our{" "}
        <Text style={styles.link} onPress={() => openLink("https://md-musa.github.io/cholo_terms_and_conditions/")}>
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text style={styles.link} onPress={() => openLink("https://md-musa.github.io/cholo_privacy-policy/")}>
          Privacy Policy
        </Text>
        .
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  link: {
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
});

export default LegalLinks;
