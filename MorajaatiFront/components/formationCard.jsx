import React, {useEffect, useState} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Icons } from "../constants/Icons";
import {getCourseThumbnail} from "../app/courseThumbnail";
import {isCancel} from "axios";
import { useRouter } from "expo-router";

const FormationCard = ({ formation, onPress }) => {
  console.log("Displaying formation:  " + formation);
  
  const router = useRouter();
  const [thumbnailSource, setThumbnailSource] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchThumbnail = async () => {
      try {
        const dataUri = await getCourseThumbnail(formation.courseId);
        if (isMounted && dataUri) {
          setThumbnailSource({ uri: dataUri });
        }
      } catch (error) {
        if (isMounted && !isCancel(error)) {
          console.error('Error fetching thumbnail:', error);
          setThumbnailSource(Icons.thumb);
        }
      }
    };

    fetchThumbnail();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [formation.courseId]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("fr-FR", options).replace(/\./g, "");
    } catch (error) {
      return dateString;
    }
  };

  const formatStudentCount = (count) => {
    const studentCount = count || 0;
    return `${studentCount} étudiant${studentCount !== 1 ? "s" : ""}`;
  };

  const handleFormationPress = () => {
    console.log("Navigating to formation with ID:", formation.courseId);
    // Navigate to ProfFormation screen with the formation ID
    router.push(`./profFormation?formationId=${formation.courseId}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleFormationPress}
    >
      <View style={styles.card}>
        <Image
          style={styles.cardImage}
          source={thumbnailSource}
          defaultSource={Icons.thumb}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{formation.courseTitle}</Text>
          <Text style={styles.cardMeta}>
            <Image source={Icons.students} style={styles.iconStyles} />
            {formatStudentCount(formation.numberOfEnrolledStudents)} ·{" "}
            {formatDate(formation.creationDate)}
          </Text>
        </View>
        <Image source={Icons.plus} style={styles.iconStyles} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#222",
  },
  cardMeta: {
    fontSize: 13,
    color: "#666",
  },
  iconStyles: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
});

export default FormationCard;