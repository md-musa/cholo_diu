import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>🛡️ Privacy Policy</Text>

        <Text style={{ color: "gray", fontSize: 12, marginBottom: 20 }}>Effective Date: Oct 28, 2025</Text>

        <Text style={styles.text}>
          Welcome to <Text style={{ fontWeight: "bold" }}>Cholo</Text>! This Privacy Policy explains how we collect,
          use, and protect your information while using our app. We are committed to ensuring your privacy and data
          security.
        </Text>

        {/* Location Data */}
        <Text style={styles.heading}>📍 Location Data</Text>

        <Text style={styles.subheading}>1. Foreground Location Access</Text>
        <Text style={styles.text}>We use your location while the app is open to:</Text>
        <BulletList
          items={[
            "Show your position on the map.",
            "Help you track buses in real-time.",
            "Provide navigation and route-based features.",
          ]}
        />

        <Text style={styles.subheading}>2. Background Location Access</Text>
        <Text style={styles.text}>
          With your permission, we may access your location even when the app is not actively in use:
        </Text>
        <BulletList
          items={[
            "Allow bus drivers or users to broadcast location during trips.",
            "Ensure real-time tracking for students depending on live updates.",
          ]}
        />

        <Text style={styles.note}>
          You can enable or disable location access at any time from your device settings. Disabling background access
          may limit certain features.
        </Text>

        {/* Data Collection */}
        <Text style={styles.heading}>📦 Information We Collect</Text>
        <BulletList
          items={[
            "Location data — used only for real-time tracking features.",
            "Account information (name, email) when you register or log in.",
            "Device and usage data (app version, device type) for performance and analytics.",
          ]}
        />

        {/* Data Usage */}
        <Text style={styles.heading}>🔐 How We Use Your Data</Text>
        <BulletList
          items={[
            "To provide real-time tracking and improve app performance.",
            "To personalize your experience and route information.",
            "To maintain security and prevent misuse of the app.",
            "We do not share or sell your personal or location data to any third party.",
          ]}
        />

        {/* Data Protection */}
        <Text style={styles.heading}>🧱 Data Security</Text>
        <Text style={styles.text}>
          We take appropriate technical and organizational measures to safeguard your information. All communication is
          secured using encryption standards to prevent unauthorized access or misuse.
        </Text>

        {/* Data Storage */}
        <Text style={styles.heading}>💾 Data Retention</Text>
        <Text style={styles.text}>
          We retain your data only as long as necessary to provide our services. Once data is no longer needed, it is
          securely deleted from our systems.
        </Text>

        {/* Third Parties */}
        <Text style={styles.heading}>🤝 Third-Party Services</Text>
        <Text style={styles.text}>
          Our app may use third-party tools (like Google Maps or Expo Services) that have their own privacy policies. We
          encourage you to review their policies to understand how they handle your information.
        </Text>

        {/* User Control */}
        <Text style={styles.heading}>⚙️ Your Rights and Control</Text>
        <BulletList
          items={[
            "You can review, edit, or delete your account information at any time.",
            "You can manage location permissions in your device settings.",
            "You may request data deletion or account removal by contacting us.",
          ]}
        />

        {/* Children Policy */}
        <Text style={styles.heading}>👶 Children’s Privacy</Text>
        <Text style={styles.text}>
          Our app is designed for university students and is not intended for children under 13. We do not knowingly
          collect personal data from minors.
        </Text>

        {/* Policy Updates */}
        <Text style={styles.heading}>🔄 Policy Updates</Text>
        <Text style={styles.text}>
          We may occasionally update this Privacy Policy. Any changes will be reflected in the app, and continued use
          after updates means you agree to the revised terms.
        </Text>

        {/* Contact */}
        <Text style={styles.heading}>📞 Contact Us</Text>
        <Text style={styles.text}>If you have any questions, reach us at:</Text>
        <Text style={styles.text}>Email: mohammad.musa.dev@gmail.com</Text>

        <Text style={{ marginTop: 20, fontWeight: "bold" }}>
          By using this app, you agree to the terms of this Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const BulletList = ({ items }) => (
  <View style={{ paddingLeft: 15, marginBottom: 10 }}>
    {items.map((item, idx) => (
      <Text key={idx} style={styles.bullet}>
        • {item}
      </Text>
    ))}
  </View>
);

const styles = {
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  note: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 10,
  },
  bullet: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
};

export default PrivacyPolicyScreen;
