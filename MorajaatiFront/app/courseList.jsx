import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router";
import BottomMenu from "../components/bottomMenu";
import { Icons } from "../constants/Icons";
import { Colors } from "../constants/Colors";
import CourseCard from "../components/courseCard";
import api from "./api";

const categories = ["Tout", "Chemistry", "Physics", "Mathematics"];

const ListCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8090/api/courses/all")
      .then((response) => {
        setAllCourses(response.data);
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Erreur récupération cours :", error);
        const dummy = Array(10)
          .fill(null)
          .map((_, idx) => ({
            courseInfo: {
              id: `dummy-${idx}`,
              title: "2 BAC SM BIOF Math Teacher",
              description: "Exemple de description…",
              rating: 5.0,
              numberOfReviews: 1200,
              subject: "Mathematiques",
              price: {
                amount: 99.99,
                currency: "EUR",
              },
            },
            professor: {
              lastName: "Arddour",
              specialisation: "Mathematiques",
            },
            courseStatistics: {
              numberOfEnrolledStudents: 0,
            },
          }));

        setAllCourses(dummy);
        setCourses(dummy);
      });
  }, []);

  useEffect(() => {
    filterCourses();
  }, [selectedCategory, searchText]);

  const filterCourses = () => {
    let filtered = [...allCourses];

    if (selectedCategory !== 0) {
      const cat = categories[selectedCategory].toLowerCase();
      filtered = filtered.filter((course) => {
        const subj = course.professor?.specialisation.toLowerCase() ?? "";
        return subj === cat;
      });
    }

    if (searchText.trim() !== "") {
      const txt = searchText.toLowerCase().trim();
      filtered = filtered.filter((course) => {
        const { title } = course.courseInfo;
        const { lastName } = course.professor || { lastName: "" };
        const subj = course.professor?.specialisation?.toLowerCase() ?? "";

        return (
          title.toLowerCase().includes(txt) ||
          lastName.toLowerCase().includes(txt) ||
          subj.includes(txt)
        );
      });
    }

    setCourses(filtered);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleCategorySelect = (index) => {
    setSelectedCategory(index);
  };

  const renderCourse = ({ item }) => {
    const {
      courseInfo: { id, title, rating, numberOfReviews, price },
      professor,
    } = item;

    return (
      <CourseCard
        key={id}
        id={id} // ← On passe maintenant la prop id
        title={title}
        professor={professor}
        rating={rating}
        numberOfReviews={numberOfReviews}
        price={price}
        imageSource={{
          uri: `http://localhost:8090/api/courses/${id}/thumbnail`,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.connexionBtn}>
          <Text style={styles.btnText}>Etudiant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profBtn}
          onPress={() => {
            router.push("./profDashboard");
          }}
        >
          <Text style={styles.btnText}>Prof</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Recherche"
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={filterCourses}>
          <Image source={Icons.srch} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.categories}>
        {categories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.catBtn, i === selectedCategory && styles.catActive]}
            onPress={() => handleCategorySelect(i)}
          >
            <Text
              style={[
                styles.catText,
                i === selectedCategory && styles.catTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Formations Populaires</Text>

      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.courseInfo.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucun cours ne correspond à votre recherche
          </Text>
        }
      />

      <BottomMenu />
    </SafeAreaView>
  );
};

export default ListCourses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.backgroundColor,
  },
  topBar: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: Colors.lightGrey,
    borderRadius: 30,
    width: 120,
  },
  connexionBtn: {
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 30,
  },
  profBtn: {
    backgroundColor: Colors.lightGrey,
    padding: 10,
    borderRadius: 30,
  },
  btnText: {
    color: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  catBtn: {
    backgroundColor: "#EAEAEA",
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  catActive: {
    backgroundColor: "#1976D2",
  },
  catText: {
    color: "#000",
  },
  catTextActive: {
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginVertical: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#666",
  },
});
