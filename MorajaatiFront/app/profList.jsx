import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomMenu from "../components/bottomMenu";
import { router } from "expo-router";
import { Icons } from "../constants/Icons";
import { Colors } from "../constants/Colors";
import api from "./api";


const categories = ["Tout", "Chemistry", "Physics", "Mathematics",];

const ProfList = () => {
  const [allProfessors, setAllProfessors] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchText, setSearchText] = useState("");

  const dummyProfs = [
    { id: 1, lastName: "Adrdour", specialisation: "Mathematiques", imageUrl: null },
    { id: 2, lastName: "Badaoui", specialisation: "Physique", imageUrl: null },
    { id: 3, lastName: "Ouissam", specialisation: "Français", imageUrl: null },
    { id: 4, lastName: "Elboukhari", specialisation: "Mathematiques", imageUrl: null },
    { id: 5, lastName: "Chokairi", specialisation: "Physique", imageUrl: null },
    { id: 6, lastName: "Taousse", specialisation: "Français", imageUrl: null },
    { id: 7, lastName: "Laauani", specialisation: "SVT", imageUrl: null },
    { id: 8, lastName: "Adrdour", specialisation: "Mathematiques", imageUrl: null },
    { id: 9, lastName: "Elboukhari", specialisation: "Mathematiques", imageUrl: null },
    { id: 10, lastName: "Ouissam", specialisation: "Français", imageUrl: null },
    { id: 11, lastName: "Chokairi", specialisation: "Physique", imageUrl: null },
    { id: 12, lastName: "Taousse", specialisation: "Anglais", imageUrl: null },
    { id: 13, lastName: "Taousse", specialisation: "Anglais", imageUrl: null },
    { id: 14, lastName: "Laauani", specialisation: "SVT", imageUrl: null },
    { id: 15, lastName: "Adrdour", specialisation: "Mathematiques", imageUrl: null },
  ];

  useEffect(() => {
    const fetchProfessors = () => {
      setLoading(true);
      setError(null);
      
      api.get('/api/professors')
        .then(response => {
          const formattedData = response.data.map(prof => ({
            id : prof.id,
            lastName: prof.lastName,
            specialisation: prof.specialisation,
            imageUrl: prof.imageUrl ? { uri: prof.imageUrl } : null
          }));
          setAllProfessors(formattedData);
          setProfessors(formattedData);
        })
        .catch(err => {
          console.error("API Error:", err);
          setError(err.message);
          setAllProfessors(dummyProfs);
          setProfessors(dummyProfs);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchProfessors();
  }, []);

  useEffect(() => {
    filterProfessors();
  }, [selectedCategory, searchText]);

  const filterProfessors = () => {
    let filtered = [...allProfessors];

    // Filter by category
    if (selectedCategory !== 0) {
      const cat = categories[selectedCategory];
      filtered = filtered.filter((prof) => {
        return prof.specialisation === cat;
      });
    }

    // Filter by search text
    if (searchText.trim() !== "") {
      const txt = searchText.toLowerCase().trim();
      filtered = filtered.filter((prof) => {
        const lastName = prof.lastName.toLowerCase();
        const specialisation = prof.specialisation.toLowerCase();

        return (
          lastName.includes(txt) ||
          specialisation.includes(txt)
        );
      });
    }

    setProfessors(filtered);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleCategorySelect = (index) => {
    setSelectedCategory(index);
  };

  const getImageSource = (prof) => {
    if (prof.imageUrl) {
      return prof.imageUrl;
    }
    return require('../assets/img/anonyme.jpeg');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#000080" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Rechercher un professeur..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={filterProfessors}>
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

      <Text style={styles.title}>Profs</Text>

      <View style={styles.profsContainer}>
        {professors.length > 0 ? (
          <FlatList
            data={professors}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.profItem}
                onPress={()=>{router.push(`/profProfile?profId=${item.id}`)}}
                activeOpacity={0.7}
              >
                <Image 
                  source={getImageSource(item)}
                  style={styles.profImage}
                />
                <Text style={styles.profName}>Pr. {item.lastName}</Text>
                <Text style={styles.profSubject}>{item.specialisation}</Text>
              </TouchableOpacity>
            )}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.noResults}>
                Aucun professeur ne correspond à votre recherche
              </Text>
            }
          />
        ) : (
          <Text style={styles.noResults}>Aucun professeur trouvé</Text>
        )}
        {error && (
          <Text style={styles.errorText}>Note: Using fallback data due to connection issues</Text>
        )}
      </View>

      <BottomMenu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
    marginLeft: 20,
    marginRight: 17,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginLeft: 17,
    marginRight: 17,
    marginTop:25,
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
    marginLeft: 17,
    marginRight: 17,
    marginTop:10,
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
  profsContainer: {
    flex: 1,
    marginLeft: 17,
    marginRight: 17,
  },
  profItem: {
    width: "32%",
    margin: "0.66%",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  profImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  profName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  profSubject: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  noResults: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
  },
  errorText: {
    marginTop: 10,
    textAlign: "center",
    color: "#FF0000",
  }
});

export default ProfList;