import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";

import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const SeanceScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [seance, setSeance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoStatus, setVideoStatus] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchSeance = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/seances/${id}`);
        setSeance(response.data);
      } catch (error) {
        console.error("Error fetching seance:", error);
        setSeance(getDummySeance(id));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeance();
  }, [id]);

  // dummy data
  const getDummySeance = (id) => ({
    id: id,
    title: "Séance " + id,
    description: "Description détaillée de la séance sur les ondes lumineuses.",
    videoUrl: "http://localhost:8090/api/courses/id.mp4",
    duration: "1:23:00",
    date: "15/9/2024",
    documents: [
      {
        id: 1,
        title: "Introduction",
        type: "pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: 2,
        title: "Exercices",
        type: "description",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  });

  const handleDocumentPress = (docId) => {
    console.log("Open document:", docId);
    // Implement document opening logic here
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{seance.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View
        style={isFullscreen ? styles.fullscreenVideo : styles.videoContainer}
      >
        <Video
          source={{ uri: seance.videoUrl }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          shouldPlay={false}
          useNativeControls
          style={styles.video}
          onFullscreenUpdate={(e) => setIsFullscreen(e.fullscreenUpdate === 1)}
          onPlaybackStatusUpdate={(status) => setVideoStatus(() => status)}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>À propos de cette séance</Text>
          <Text style={styles.description}>{seance.description}</Text>

          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>Durée: {seance.duration}</Text>
            <Text style={styles.metaText}>Date: {seance.date}</Text>
          </View>
        </View>

        {seance.documents?.length > 0 && (
          <View style={styles.documentsSection}>
            <Text style={styles.sectionTitle}>Documents associés</Text>
            {seance.documents.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={styles.documentCard}
                onPress={() =>
                  router.push({
                    pathname: "pdfviewer",
                    params: {
                      title: doc.title,
                      url: doc.url,
                      type: doc.type || "pdf",
                    },
                  })
                }
              >
                <MaterialIcons
                  name={doc.type === "pdf" ? "picture-as-pdf" : "description"}
                  size={24}
                  color={doc.type === "pdf" ? "red" : "blue"}
                />
                <Text style={styles.documentText}>{doc.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  videoContainer: {
    height: 250,
    backgroundColor: "black",
  },
  fullscreenVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    zIndex: 100,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: "#333",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
  documentsSection: {
    marginTop: 16,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },
  documentText: {
    marginLeft: 12,
    fontSize: 14,
  },
});

export default SeanceScreen;
