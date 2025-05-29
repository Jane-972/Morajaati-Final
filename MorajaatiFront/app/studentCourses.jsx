import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from '../components/bottomMenu';
import FormationCard from '../components/formationCard';
import { Icons } from '../constants/Icons';
import { Colors } from '../constants/Colors';
import api from "./api";
import { router } from 'expo-router';

const dummyCourses = [
  {
    id: '1',
    title: '2 BAC SM BIOF Math T9achr',
    date: 'Mai 14, 22:00',
    students: '40 étudiant',
  },
  {
    id: '2',
    title: '2 BAC SM BIOF Math T9achr',
    date: 'Mai 14, 22:00',
    students: '40 étudiant',
  },
  {
    id: '3',
    title: '2 BAC SM BIOF Math T9achr',
    date: 'Mai 14, 22:00',
    students: '40 étudiant',
  },
];

const dummyStudentInfo = {
  name: 'Étudiant',
  image: null,
};

export default function StudentDashboardScreen() {
  const [courses, setCourses] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const studentInfoString = await AsyncStorage.getItem("studentInfo");
        let studentData;
        if (studentInfoString) {
          studentData = JSON.parse(studentInfoString);
          setStudentInfo(studentData);
        } else {
          console.log(
            "No student info found in AsyncStorage, using dummy data"
          );
          studentData = dummyStudentInfo;
          setStudentInfo(studentData);
        }

        try {
          console.log("Student ID:", studentData.id);
          const response = await api.get('/api/students/me/courses');
          let courseIds = response.data.map(course => course.courseInfo.id);
          console.log(response.data);
          
          const coursesData = await Promise.all(
            courseIds.map(async (courseId) => {
              try {
                const courseResponse = await api.get(`/api/courses/${courseId}`);
                return courseResponse.data;
              } catch (error) {
                console.error(`Error fetching details for course ${courseId}:`, error);
                return null; // or handle the error as you prefer
              }
            })
          );

          // Filter out any null values if there were errors
          const mappedCourses = coursesData.filter(course => course !== null)
            .map(course => ({
              courseId: course.courseInfo.id,
              courseTitle: course.courseInfo.title,
              creationDate: course.courseInfo.uploadDate,
              numberOfEnrolledStudents: course.courseStatistics.numberOfEnrolledStudents
            }));

          console.log("courses: ", mappedCourses);

          setCourses(mappedCourses);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      } catch (error) { 
        console.error("Unexpected error during data fetching:", error);
      }
    };

    fetchAllData();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleDateString('fr-FR', options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <TouchableOpacity>
              {studentInfo?.image ? (
                <Image source={{ uri: studentInfo.image }} style={styles.avatar} />
              ) : (
                <Image source={require("../assets/icons/user.png")} style={styles.avatar} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes Cours</Text>
            <TouchableOpacity onPress={() => { router.push('./browseCourses') }}>
              <Image source={Icons.search} style={styles.searchIconStyles}/>
            </TouchableOpacity>
          </View>

          {courses.length > 0 ? (
            courses.map(item => (
              <FormationCard key={item.courseId} formation={item} onPress={(course) => {
                router.push(`./courseDetails/${course.courseId}`);
              }}/>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucun cours inscrit</Text>
              <TouchableOpacity 
                style={styles.browseBtn}
                onPress={() => { router.push('./browseCourses') }}
              >
                <Text style={styles.browseBtnText}>Parcourir les cours</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  welcome: { 
    fontSize: 16, 
    color: '#666' 
  },
  name: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  profileContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20 
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#001f7f',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  section: { 
    marginTop: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: Colors.headerColor
  },
  viewAll: { 
    color: '#0033cc', 
    fontSize: 14,
    fontWeight: '500',
  },

  searchIconStyles: {
    width: 30,
    height: 30,
  },
  
  browseBtn: {
    backgroundColor: '#001f7f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  browseBtnText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 14,
  },

  time: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  avatarStyles: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
});