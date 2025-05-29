import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import BottomMenu from "../components/bottomMenu";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "./api";

const ProfFormation = () => {
  const route = useRoute();
  const searchParams = useLocalSearchParams();

  const formationId = route.params?.formationId || searchParams.formationId;

  const [formation, setFormation] = useState(null);
  const [seances, setSeances] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (formationId) {
      fetchFormationData();
    }
  }, [formationId]);

  const fetchFormationData = async () => {
    try {
      setError(null);

      const formationResponse = await api.get(`/api/courses/${formationId}`);
      setFormation(formationResponse.data);

      const seancesResponse = await api.get(
        `/api/chapters/${formationId}/chapters`
      );
      setSeances(seancesResponse.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSeance = () => {
    router.push(`./profAddSession?formationId=${formationId}`);
  };

  const handleSeancePress = (seance) => {
    router.push(`./profSeance?seanceId=${seance.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!formationId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Formation introuvable</Text>
        </View>
        <BottomMenu />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Image
          source={
            formation?.thumbnail
              ? require("../assets/icons/thumb.jpg")
              : require("../assets/icons/num.jpg")
          }
          style={styles.banner}
        />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {formation?.courseInfo.title || "Formation"}
            </Text>
            <TouchableOpacity style={styles.subjectTag}>
              <Text style={styles.subjectText}>
                {formation?.professor.specialisation}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.priceContainer}>
            <Text
              style={styles.price}
              onPress={() => {
                router.push("./profSeance");
              }}
            >
              {formation?.courseInfo.price.amount} MAD
            </Text>
            <Text style={styles.priceUnit}>/ mois</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              {formation?.courseInfo.rating?.toFixed(1) || "5.0"}
            </Text>
            <Icon name="star" color="#ff9500" size={16} />
            <Text style={styles.reviews}>
              ({formation?.courseInfo.numberOfReviews || 0})
            </Text>
          </View>
          <View style={styles.studentsCount}>
            <Icon name="people" size={16} color="#666" />
            <Text style={styles.studentsText}>
              {formation?.courseStatistics.numberOfEnrolledStudents || 0}{" "}
              étudiants
            </Text>
          </View>
        </View>

        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            {formation?.courseInfo.description || "Description non disponible"}
          </Text>

          <View style={styles.additionalInfo}>
            <View style={styles.infoItem}>
              <Icon name="person" size={16} color="#666" />
              <Text style={styles.infoText}>
                Prof. {formation?.professor.lastName || "Non spécifié"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="location-on" size={16} color="#666" />
              <Text style={styles.infoText}>En ligne</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Séances ({seances.length})</Text>
            <Text style={styles.sectionSubtitle}>
              {seances.length} séances disponibles
            </Text>
          </View>
          <TouchableOpacity onPress={handleAddSeance} style={styles.addButton}>
            <Icon name="add-circle" size={28} color="#0055ff" />
          </TouchableOpacity>
        </View>

        {seances.length > 0 ? (
          <ScrollView
            horizontal
            style={styles.sessionScroll}
            showsHorizontalScrollIndicator={false}
          >
            {seances.map((seance) => (
              <TouchableOpacity
                key={seance.id}
                style={styles.sessionCard}
                onPress={() => handleSeancePress(seance)}
              >
                <Image
                  source={{
                    uri: `http://localhost:8090/api/chapters/${seance.id}/thumbnail`,
                  }}
                  style={styles.sessionImage}
                />
                <View style={styles.sessionContent}>
                  <Text style={styles.sessionTitle} numberOfLines={1}>
                    {seance.title}
                  </Text>
                  <Text style={styles.sessionDate}>
                    {formatDate(seance.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="video-library" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>Aucune séance disponible</Text>
            <Text style={styles.emptyStateSubtext}>
              Les séances apparaîtront ici une fois ajoutées
            </Text>
          </View>
        )}
      </ScrollView>
      <BottomMenu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  header: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    // kept empty as it's used
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0055ff",
  },
  priceUnit: {
    fontSize: 12,
    color: "#666",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  subjectTag: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 75,
  },
  subjectText: {
    fontSize: 13.5,
    color: "#0055ff",
    fontWeight: "500",
  },
  studentsCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentsText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  descriptionBox: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    marginBottom: 15,
  },
  additionalInfo: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
  },
  sectionHeader: {
    paddingHorizontal: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  addButton: {
    padding: 5,
  },
  sessionScroll: {
    paddingLeft: 15,
    marginBottom: 20,
  },
  sessionCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  sessionContent: {
    padding: 10,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
});

export default ProfFormation;
