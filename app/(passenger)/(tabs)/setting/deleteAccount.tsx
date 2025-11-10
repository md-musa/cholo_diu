import { axiosBaseQuery } from "@/config/axiosBaseQuery";
import apiClient from "@/config/axiosInstance";
import { ASYNC_STORAGE_KEYS } from "@/constants";
import { clearCredentials } from "@/store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";

export default function DeleteAccountScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  // console.log("Current User:", user);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.CURRENT_ROUTE);
      await AsyncStorage.clear();

      dispatch(clearCredentials());

      router.replace("/(auth)/login");
    } catch (err) {
      //console.log("Logout failed:");
      //console.log(JSON.stringify(err, null, 2) || err);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete your account? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          setMessage("");
          try {
            const response = await apiClient.delete("/auth/delete/" + user?._id);
            if (response.success) {
              setMessage("✅ Account deleted successfully.");
              handleLogout();
            } else {
              setMessage("❌ Failed to delete account. Try again later.");
            }
          } catch (error) {
           // console.error(error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.warningText}>
        Once deleted, your data will be permanently removed. This action cannot be undone.
      </Text>

      <TouchableOpacity
        style={[styles.deleteButton, loading && { opacity: 0.6 }]}
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.deleteText}>Delete My Account</Text>}
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },
  warningText: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    marginTop: 20,
    color: "#333",
    fontSize: 14,
  },
});
