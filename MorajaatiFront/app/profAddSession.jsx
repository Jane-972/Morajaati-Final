import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import BottomMenu from "../components/bottomMenu";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { Icons } from "../constants/Icons";

const ProfAddSession = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const chooseVideo = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access media library is required!"
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedVideo(result.assets[0]);
        Alert.alert("Success", "Video selected successfully!");
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to pick video");
    }
  };

  const chooseDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedDocuments(result.assets || [result]);
        Alert.alert(
          "Success",
          `${result.assets?.length || 1} document(s) selected!`
        );
      }
    } catch (error) {
      console.error("Error picking documents:", error);
      Alert.alert("Error", "Failed to pick documents");
    }
  };

  const uploadFile = async (file, type = "document") => {
    const formData = new FormData();

    const fileObj = {
      uri: file.uri,
      type: file.mimeType || "application/octet-stream",
      name: file.name || `${type}_${Date.now()}`,
    };

    formData.append("file", fileObj);
    formData.append("type", type);

    try {
      const response = await axios.post(
        `http://localhost:8090/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw new Error(`Failed to upload ${type}`);
    }
  };

  const addSession = async () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Please enter a title");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Validation Error", "Please enter a description");
      return;
    }

    try {
      let videoUrl = null;
      let documentUrls = [];
      if (selectedVideo) {
        const videoResponse = await uploadFile(selectedVideo, "video");
        videoUrl = videoResponse.url || videoResponse.fileId;
      }
      if (selectedDocuments.length > 0) {
        const documentPromises = selectedDocuments.map((doc) =>
          uploadFile(doc, "document")
        );
        const documentResponses = await Promise.all(documentPromises);
        documentUrls = documentResponses.map((res) => res.url || res.fileId);
      }

      const sessionData = {
        title: title.trim(),
        description: description.trim(),
        videoUrl,
        documentUrls,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `http://localhost/api//sessions`,
        sessionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Session added successfully!", [
          {
            text: "OK",
            onPress: () => {
              setTitle("");
              setDescription("");
              setSelectedVideo(null);
              setSelectedDocuments([]);
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error adding session:", error);

      let errorMessage = "Failed to add session";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.containerFlex}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Ajouter une nouvelle séance</Text>

        <Text style={styles.label}>Titre</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Entrez le titre de la séance"
          editable={!loading}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Entrez la description de la séance"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!loading}
        />

        <Text style={styles.label}>Vidéo</Text>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            {selectedVideo ? (
              <Image source={{ uri: selectedVideo.uri }} style={styles.icon} />
            ) : (
              <View style={[styles.icon, styles.placeholderIcon]}>
                <Image source={Icons.video} style={styles.icon} />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={chooseVideo}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {selectedVideo ? "Changer la Vidéo" : "Choisissez une Vidéo"}
            </Text>
          </TouchableOpacity>
        </View>
        {selectedVideo && (
          <Text style={styles.fileInfo}>
            Vidéo sélectionnée: {selectedVideo.fileName || "video.mp4"}
          </Text>
        )}

        <Text style={styles.label}>Documents</Text>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <View style={[styles.icon, styles.placeholderIcon]}>
              <Image source={Icons.pdf} style={styles.icon} />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={chooseDocuments}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {selectedDocuments.length > 0
                ? `${selectedDocuments.length} Document(s) sélectionné(s)`
                : "Choisissez des Documents"}
            </Text>
          </TouchableOpacity>
        </View>
        {selectedDocuments.length > 0 && (
          <View style={styles.documentsInfo}>
            {selectedDocuments.map((doc, index) => (
              <Text key={index} style={styles.fileInfo}>
                • {doc.name}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={addSession}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Ajouter une séance</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <BottomMenu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    paddingBottom: 15,
  },
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A3D5E",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
  textArea: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    height: 100,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    width: 60,
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  placeholderIcon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  placeholderText: {
    fontSize: 24,
  },
  button: {
    backgroundColor: "#59A7DF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: "#00114C",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  fileInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    marginLeft: 70,
  },
  documentsInfo: {
    marginLeft: 70,
    marginTop: 5,
  },
});

export default ProfAddSession;
