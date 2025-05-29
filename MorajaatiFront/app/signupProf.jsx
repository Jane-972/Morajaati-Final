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
import axios from "axios";
import { useRouter } from "expo-router";

export default function SignUpStudent() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specilite, setSpecilite] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const err = {};

    if (!prenom) err.prenom = "Le prénom est requis";
    if (!nom) err.nom = "Le nom est requis";

    if (!email) {
      err.email = "L'email est requis";
    } else if (!/\S+@\S+\.com$/.test(email)) {
      err.email = "Format d'email invalide";
    }

    if (!password) {
      err.password = "Le mot de passe est requis";
    }

    if (!confirmPassword) {
      err.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (password !== confirmPassword) {
      err.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    if (!specilite) {
      err.specilite = "La specialite est requise";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8090/api/users", {
        firstName: prenom,
        lastName: nom,
        email: email,
        password: password,
        role: "TEACHER",
      });

      console.log("Sign up success:", response.data);
      Alert.alert("Succès", "Inscription réussie !");
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
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
        onPress={() => router.push("/homePageStudent")}
      >
        Créer un compte
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Prénom</Text>
        <TextInput
          placeholder="john"
          placeholderTextColor="#aaa"
          style={[styles.input, errors.prenom && styles.inputError]}
          value={prenom}
          onChangeText={setPrenom}
        />
        {errors.prenom && <Text style={styles.errorText}>{errors.prenom}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          placeholder="Doe"
          placeholderTextColor="#aaa"
          style={[styles.input, errors.nom && styles.inputError]}
          value={nom}
          onChangeText={setNom}
        />
        {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="john.doe@gmail.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          placeholder="*****"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={[styles.input, errors.password && styles.inputError]}
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmer le mot de passe</Text>
        <TextInput
          placeholder="*****"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Specialite</Text>
        <TextInput
          placeholder="Mathematique"
          placeholderTextColor="#aaa"
          style={[styles.input, errors.specilite && styles.inputError]}
          value={specilite}
          onChangeText={setSpecilite}
        />
        {errors.specilite && (
          <Text style={styles.errorText}>{errors.specilite}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
        <Text style={styles.loginText}>S'inscrire</Text>
      </TouchableOpacity>
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
});
