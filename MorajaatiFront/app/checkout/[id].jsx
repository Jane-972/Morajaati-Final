import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Icons } from "../../constants/Icons";
import api from "../api";

const Checkout = () => {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const params = useLocalSearchParams();
  const courseId = params.id;
  
  console.log("Course ID:", courseId);
  console.log("All params:", params);

  const mockCourse = {
    id: 1,
    title: "shi cours",
    teacher: "Dr. Smayka",
    price: {
      amount: 2.5,
      currency: "MAD"
    },
    imageUrl: Icons.thumb,
  };

  useEffect(() => {
    fetchCourseInfo();
  }, [courseId]);

  const fetchCourseInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!courseId) {
        console.log("No courseId provided, using mock course");
        setCourse(mockCourse);
        setLoading(false);
        return;
      }

      console.log("Fetching course with ID:", courseId);

      const email = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("password");
      
      const authHeader = "Basic " + btoa(`${email}:${password}`);
      console.log("Making API request to:", `/api/courses/${courseId}`);
      
      const response = await api.get(`/api/courses/${courseId}`, {
        headers: { 
          Authorization: authHeader,
          'Content-Type': 'application/json'
        },
      });

      console.log("API Response:", response);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.data) {
        const transformedCourse = {
          id: response.data.courseInfo?.id,
          title: response.data.courseInfo?.title || "Course Title",
          teacher: response.data.professor 
            ? `${response.data.professor.firstName} ${response.data.professor.lastName}`
            : "Unknown Teacher",
          price: response.data.courseInfo?.price || { amount: 0, currency: "EUR" },
          numberOfReviews: response.data.courseInfo?.numberOfReviews,
        };
        
        console.log("Transformed course:", transformedCourse);
        setCourse(transformedCourse);
      } else {
        console.log("No data in response, using mock course");
        setCourse(mockCourse);
      }

    } catch (error) {
      console.error("Error fetching course:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      setError(error.message || "Failed to fetch course");
      
      // For development, show more detailed error
      if (__DEV__) {
        Alert.alert("Debug Error", `${error.message}\nStatus: ${error.response?.status}\nData: ${JSON.stringify(error.response?.data)}`);
      } else {
        Alert.alert("Erreur", "Impossible de charger le cours");
      }
      
      // Fallback to mock course for now
      setCourse(mockCourse);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      if (!courseId) {
        Alert.alert("Erreur", "ID du cours manquant");
        return;
      }

      const email = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("password");
      
      if (!email || !password) {
        Alert.alert("Erreur", "Veuillez vous connecter");
        return;
      }

      const authHeader = "Basic " + btoa(`${email}:${password}`);

      console.log("Making payment request for course:", courseId);
      console.log("Amount:", course.price?.amount);

      const response = await axios.post(
        "http://172.16.1.219:8090/api/checkout",
        {
          amount: Math.round((course.price?.amount || 0) * 100),
          courseId: courseId,
        },
        {
          headers: { 
            Authorization: authHeader,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log("Payment response:", response.data);

      const { clientSecret } = response.data;

      // For now, just show success (remove this when Stripe is properly set up)
      Alert.alert("Succès", "Paiement simulé réussi !", [
        { text: "OK", onPress: () => router.back() },
      ]);
      
    } catch (error) {
      console.error("Payment error:", error);
      console.error("Payment error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      Alert.alert("Erreur", "Impossible de traiter le paiement");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Chargement du cours...</Text>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => router.back()}
        >
          <Text style={styles.payButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error && !course) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
        <TouchableOpacity
          style={styles.payButton}
          onPress={fetchCourseInfo}
        >
          <Text style={styles.payButtonText}>Réessayer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: '#666', marginTop: 10 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.payButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Aucun cours trouvé</Text>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => router.back()}
        >
          <Text style={styles.payButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.courseCard}>
          <Image 
            source={{ uri: `http://172.16.1.219:8090/api/courses/${course.id}/thumbnail` }} 
            style={styles.courseImage} 
          />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseTeacher}>{course.teacher}</Text>
            
            <Text style={styles.coursePrice}>
              {course.price?.amount?.toFixed(2) || "0.00"} {course.price?.currency || "EUR"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Total: {course.price?.amount?.toFixed(2) || "0.00"} {course.price?.currency || "EUR"}
        </Text>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Payer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    fontSize: 24,
    color: "#00008B",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    elevation:100,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  courseTeacher: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00008B",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  payButton: {
    backgroundColor: "#00008B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});