import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CourseCard from '../components/courseCard';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import api from './api';
import { useSearchParams } from 'expo-router/build/hooks';
import { useRoute } from '@react-navigation/core';

const ProfProfile = () => {
  const router = useRouter();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const route = useRoute();
  const paramSearch = useSearchParams();

  const profId = route?.params?.profId || paramSearch.profId;

  // Updated dummy data to match API response structure
  const dummyProfessor = {
    id: profId || '1',
    firstName: 'Mohamed',
    lastName: 'Alaoui',
    email: 'mohamed.alaoui@example.com',
    specialisation: 'Computer Science',
    description: 'Professor Mohamed Alaoui specializes in artificial intelligence and machine learning with 15 years of teaching experience.',
    imageUrl: null, // Will use placeholder
    courses: [
      {
        id: 1,
        title: '2 BAC SM BIOF',
        professor: { lastName: 'Alaoui', specialisation: 'Computer Science' },
        rating: 4.5,
        numberOfReviews: 128,
        imageSource: { uri: 'https://example.com/courses/math.jpg' },
        price: { amount: 300, currency: 'DH' },
        date: '13/9/2024 → En cours',
        level: 'T9acher',
        description: 'Cours complet de mathématiques pour BAC SM',
      },
      {
        id: 2,
        title: 'Calcul Intégral Avancé',
        professor: { lastName: 'Alaoui', specialisation: 'Computer Science' },
        rating: 4.2,
        numberOfReviews: 95,
        imageSource: { uri: 'https://example.com/courses/calculus.jpg' },
        price: { amount: 350, currency: 'DH' },
        date: '15/9/2024 → En cours',
        level: 'T10',
      },
    ],
    resources: [
      {
        id: 1,
        type: 'pdf',
        title: "Exercices d'Intégrales",
        url: 'https://example.com/resources/1.pdf',
      },
      {
        id: 2,
        type: 'doc',
        title: 'Problèmes Résolus',
        url: 'https://example.com/resources/2.docx',
      },
    ],
    videos: [
      {
        id: 1,
        title: 'Introduction aux Intégrales',
        duration: '15:32',
        url: 'https://youtube.com/watch?v=abc123',
        thumbnail: 'https://img.youtube.com/vi/abc123/mqdefault.jpg',
        date: '10/04/2024',
      },
      {
        id: 2,
        title: 'Méthodes de Résolution',
        duration: '22:45',
        url: 'https://youtube.com/watch?v=def456',
        thumbnail: 'https://img.youtube.com/vi/def456/mqdefault.jpg',
        date: '15/04/2024',
      },
    ],
  };

  console.log('Professor ID:', profId);

  useEffect(() => {
    if (!profId) {
      setError('No professor ID provided');
      setLoading(false);
      return;
    }

    const fetchProfessorData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/professors/${profId}`);
        
        if (response.data) {
          // Transform API response to match component expectations
          const transformedData = {
            ...response.data,
            // Create display name from firstName and lastName
            name: `${response.data.firstName} ${response.data.lastName}`,
            // Use specialisation as subject
            subject: response.data.specialisation,
            // Ensure arrays exist with defaults
            courses: response.data.courses || [],
            resources: response.data.resources || [],
            videos: response.data.videos || [],
          };
          
          setProfessor(transformedData);
        } else {
          throw new Error('No data received from server');
        }
      } catch (err) {
        console.warn('API Error - Using dummy data:', err.message);
        setError(err.message);
        // Use dummy data as fallback
        setProfessor(dummyProfessor);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, [profId]);

  const handleViewAll = (section) => {
    if (!professor[section] || professor[section].length === 0) {
      // Handle empty sections gracefully
      console.log(`No ${section} available for this professor`);
      return;
    }

    router.push({
      pathname: '/viewAll',
      params: {
        section,
        data: JSON.stringify(professor[section]),
        profName: professor.name || `${professor.firstName} ${professor.lastName}`,
      },
    });
  };

  const renderResourceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resourceItem}
      onPress={() =>
        router.push({
          pathname: '/documentViewer',
          params: { documentUrl: item.url, documentTitle: item.title },
        })
      }
    >
      <View style={[styles.resourceThumbnail, styles.resourceIconContainer]}>
        {item.type === 'pdf' && <MaterialIcons name="picture-as-pdf" size={50} color="red" />}
        {item.type === 'doc' && <MaterialCommunityIcons name="file-word" size={50} color="blue" />}
        {item.type === 'ppt' && <MaterialCommunityIcons name="file-powerpoint" size={50} color="red" />}
        {!['pdf', 'doc', 'ppt'].includes(item.type) && (
          <MaterialIcons name="description" size={50} color="gray" />
        )}
      </View>

      <Text style={styles.resourceTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() =>
        router.push({
          pathname: '/videoPlayer',
          params: {
            videoUrl: item.url,
            videoTitle: item.title,
            videoThumbnail: item.thumbnail,
          },
        })
      }
    >
      <Image
        source={
          imageError || !item.thumbnail
            ? require('../assets/img/video-placeholder.jpg')
            : { uri: item.thumbnail }
        }
        style={styles.videoThumbnail}
        onError={() => {
          console.log(`Failed to load thumbnail for video: ${item.title}`);
          setImageError(true);
        }}
      />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.videoMeta}>
          <Text style={styles.videoDuration}>{item.duration}</Text>
          {item.date && <Text style={styles.videoDate}>{item.date}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptySection = (sectionName) => (
    <View style={styles.emptySection}>
      <Text style={styles.emptyText}>Aucun {sectionName.toLowerCase()} disponible</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000080" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!professor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Impossible de charger les données du professeur</Text>
        {error && <Text style={styles.errorDetail}>{error}</Text>}
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            // Trigger useEffect again
            setProfessor(null);
          }}
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get display name
  const displayName = professor.name || `${professor.firstName} ${professor.lastName}`;
  const displaySubject = professor.subject || professor.specialisation;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Professor Header */}
      <View style={styles.profHeader}>
        <Image
          source={
            imageError || !professor.imageUrl
              ? require('../assets/img/anonyme.jpeg')
              : { uri: professor.imageUrl }
          }
          style={styles.profileImage}
          onError={() => setImageError(true)}
        />
        <View style={styles.profInfo}>
          <Text style={styles.name}>Pr. {displayName}</Text>
          <Text style={styles.subject}>{displaySubject}</Text>
        </View>
      </View>

      {/* Courses Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Formations</Text>
          {professor.courses && professor.courses.length > 2 && (
            <TouchableOpacity onPress={() => handleViewAll('courses')}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {professor.courses && professor.courses.length > 0 ? (
          <FlatList
            data={professor.courses.slice(0, 2)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/course',
                    params: { course: JSON.stringify(item) },
                  })
                }
              >
                <CourseCard {...item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          renderEmptySection('formations')
        )}
      </View>

      {/* Videos Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vidéos Publiques</Text>
          {professor.videos && professor.videos.length > 0 && (
            <TouchableOpacity onPress={() => handleViewAll('videos')}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {professor.videos && professor.videos.length > 0 ? (
          <FlatList
            horizontal
            data={professor.videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          renderEmptySection('vidéos')
        )}
      </View>

      {/* Resources Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ressources Pédagogiques</Text>
          {professor.resources && professor.resources.length > 0 && (
            <TouchableOpacity onPress={() => handleViewAll('resources')}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {professor.resources && professor.resources.length > 0 ? (
          <FlatList
            horizontal
            data={professor.resources}
            renderItem={renderResourceItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          renderEmptySection('ressources')
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  errorText: {
    fontSize: 18,
    color: '#E1341E',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorHelp: {
    fontSize: 14,
    color: '#000080',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#000080',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  profHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
  },
  profInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  subject: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAll: {
    color: '#002F6C',
    fontSize: 14,
    fontWeight: '500',
  },
  emptySection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  horizontalList: {
    paddingRight: 16,
  },
  resourceItem: {
    width: 120,
    marginRight: 12,
  },
  resourceThumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceIconContainer: {
    backgroundColor: '#F3F6F8',
  },
  resourceTitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  videoItem: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#F3F6F8',
  },
  videoThumbnail: {
    width: 200,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
  },
  videoInfo: {
    marginVertical: 6,
    marginHorizontal: 4,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: '#666',
  },
  videoDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default ProfProfile;