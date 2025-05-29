import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomMenu from '../components/bottomMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Icons } from '../constants/Icons';
import CourseCard from '../components/courseCard';
import api from "./api";

const categories = ['Tout', 'Mathematiques', 'Physique', 'Français'];

const HomePageStudent = () => {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    getUserData();

    api.get("/api/courses/all")
      .then(response => {
        console.log("User courses: ", response.data);
        setCourses(response.data);
        setAllCourses(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the courses!', error);
      });
  }, []);

  const filterCourses = () => {
    let filteredCourses = JSON.parse(JSON.stringify(allCourses)); 
    if (selectedCategory !== 0) {
      const categ = categories[selectedCategory].toLowerCase();
      filteredCourses = filteredCourses.filter(course => 
        (course.subject || course.category).toLowerCase() === categ
      );
    }
    if (searchText.trim() !== '') {
      const txt = searchText.toLowerCase().trim();
      filteredCourses = filteredCourses.filter(
        course => course.title.toLowerCase().includes(txt) || 
                  (course.teacher || course.instructor).toLowerCase().includes(txt) || 
                  (course.subject || course.category).toLowerCase().includes(txt)
      );
    }
    setCourses(filteredCourses); 
  };

  useEffect(() => {
    filterCourses();
  }, [selectedCategory, searchText]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleCategorySelect = (index) => {
    setSelectedCategory(index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Bonjour {userData?.name || userData?.firstName || userData?.username || 'Étudiant'} !
        </Text>
        <View style={styles.profileSection}>
          <TouchableOpacity>
            <Image 
              source={Icons.notif} 
              style={styles.icon} 
            />
          </TouchableOpacity>
          <Image 
            source= {require('../assets/img/studentProfile.jpg') }
            style={styles.profileImage} 
          />
        </View>
      </View>
      
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Recherche"
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={filterCourses}>
          <Image source={Icons?.srch || require('../assets/icons/search.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categories}>
        {categories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.catBtn, i === selectedCategory && styles.catActive]}
            onPress={() => handleCategorySelect(i)}
          >
            <Text style={[styles.catText, i === selectedCategory && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Formations Populaires</Text>

      <FlatList
        data={courses}
        renderItem={({ item }) => <CourseCard course={item} />}
        keyExtractor={(_, i) => i.toString()}
        ListEmptyComponent={
          <Text style={styles.catText}>Aucun cours ne correspond à votre recherche</Text>
        }
      />
      <BottomMenu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  greeting: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: "#0A3C53",
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: { 
    width: 40, 
    height: 40, 
    borderRadius: 20,
    marginLeft: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: { 
    flex: 1, 
    height: 40 
  },
  categories: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 10,
  },
  catBtn: { 
    backgroundColor: '#EAEAEA', 
    padding: 8, 
    borderRadius: 20, 
    margin: 4 
  },
  catActive: { 
    backgroundColor: '#000080' 
  },
  catText: { 
    color: '#000' 
  },
  catTextActive: { 
    color: '#fff' 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginVertical: 10,
    color: "#0A3C53",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
});

export default HomePageStudent;