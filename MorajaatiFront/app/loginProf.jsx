import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const err = {};
    if (!email) {
      err.email = "L'email est requis";
    } else if (!/\S+@\S+\.com$/.test(email)) {
      err.email = "Format d'email invalide";
    }
    if (!password) {
      err.password = "Le mot de passe est requis";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("pass", password);

      const response = await api.get("/api/users/me");
      console.log("Login success:", response.data);

      await AsyncStorage.setItem("profInfo", JSON.stringify(response.data));

      router.push("/profDashboard");
      Alert.alert("Succès", "Connexion réussie!");
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      Alert.alert("Erreur", "Email ou mot de passe incorrect");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/img/logoCol.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text
        style={styles.welcomeText}
        onPress={() => {
          router.push("./courseList");
        }}
      >
        Content de vous revoir
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="johndoe@gmail.com"
          placeholderTextColor="#aaa"
          style={[styles.input, errors.email && styles.inputError]}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          placeholder="*****"
          placeholderTextColor="#aaa"
          style={[styles.input, errors.password && styles.inputError]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("#")}>
        <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Nouveau ici ?{" "}
        <Text
          style={styles.signupLaterText}
          onPress={() => router.push("/signupProf")}
        >
          Inscrivez-vous.
        </Text>
      </Text>
      <Text
        style={styles.signupLaterText}
        onPress={() => {
          router.push("./courseList");
        }}
      >
        S'inscrire plus tard
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: "100%",
    height: 150,
    alignSelf: "center",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: "#0D3C4E",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 15,
    color: "#333",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    color: "#0D3C4E",
    textAlign: "center",
    marginTop: 12,
    textDecorationLine: "underline",
  },
  signupText: {
    marginTop: 40,
    textAlign: "center",
    color: "#888",
    fontSize: 14,
  },
  signupLink: {
    color: "#6C2BD9",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  signupLaterText: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 10,
    color: "#0D3C4E",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});