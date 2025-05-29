// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Base configuration
const apiClient = axios.create({
  baseURL: Platform.select({
    default: "http://localhost:8090",
  }),
  timeout: 15000, // Slightly longer timeout for mobile
  headers: {
    "Content-Type": "application/json",
    "X-Platform": Platform.OS,
    "X-App-Version": "1.0.0", // You can use a package like react-native-device-info
  },
});

// Request interceptor with AsyncStorage
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get auth data - using multiGet for better performance
      const username = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("pass");
      console.log("Connecting with username and password", username, password);

      // if (username && password) {
      config.auth = {
        username,
        password,
      };
      // }

      // Add device ID if available
      const deviceId = await AsyncStorage.getItem("deviceId");
      if (deviceId) {
        config.headers["X-Device-ID"] = deviceId;
      }

      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor for React Native
apiClient.interceptors.response.use(
  (response) => {
    // You can handle successful responses here
    // For example, automatically store new tokens
    return response;
  },
  async (error) => {
    if (!error.response) {
      // Network errors (no internet, etc.)
      console.error("Network Error:", error.message);
      throw new Error("Network error - please check your connection");
    }

    switch (error.response.status) {
      case 401:
        throw new Error("Session expired - please login again");

      case 403:
        throw new Error("Access forbidden");

      case 404:
        throw new Error("Resource not found");

      case 429:
        throw new Error("Too many requests - please wait");

      case 500:
        throw new Error("Server error - please try again later");

      default:
        throw error;
    }
  }
);

export default apiClient;
