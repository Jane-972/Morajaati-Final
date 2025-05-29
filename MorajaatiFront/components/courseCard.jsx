import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Icons } from "../constants/Icons";

const CourseCard = ({
  id,
  title,
  professor,
  rating,
  numberOfReviews,
  imageSource,
  price,
}) => {
  const router = useRouter();

  const renderStars = (ratingValue) => {
    const rawValue =
      typeof ratingValue === "number" && !isNaN(ratingValue) ? ratingValue : 0;
    const clamped = Math.max(0, Math.min(rawValue, 5));

    const fullStars = Math.floor(clamped);
    const halfStar = clamped - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={{ flexDirection: "row" }}>
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <Text key={`full-${i}`} style={styles.star}>
              ★
            </Text>
          ))}
        {halfStar && (
          <Text key="half" style={styles.star}>
            ½
          </Text>
        )}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <Text key={`empty-${i}`} style={styles.star}>
              ☆
            </Text>
          ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (id) {
          router.push(`/checkout/${id}`);
        }
      }}
    >
      <Image source={imageSource || Icons.thumb} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title || "Cours inconnu"}</Text>
        <Text style={styles.teacher}>
          Avec Pr. {professor ? professor.lastName : "Inconnu"}
        </Text>
        <Text style={styles.subject}>
          {professor ? professor.specialisation : "Spécialité inconnue"}
        </Text>

        {price && (
          <Text style={styles.price}>
            {price.amount.toFixed(2)} {price.currency}
          </Text>
        )}

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>
            {typeof rating === "number" ? rating.toFixed(1) : "0.0"}
          </Text>
          {renderStars(rating)}
          <Text style={styles.reviewCount}>({numberOfReviews || 0})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  teacher: {
    color: "#444",
    marginTop: 4,
  },
  subject: {
    color: "#E1341E",
    fontWeight: "bold",
    marginTop: 2,
  },
  price: {
    color: "#1976D2",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: {
    color: "orange",
    fontSize: 14,
    marginRight: 4,
  },
  reviewCount: {
    color: "orange",
    fontSize: 14,
    marginLeft: 4,
  },
  star: {
    fontSize: 14,
    color: "orange",
    marginHorizontal: 1,
  },
});
