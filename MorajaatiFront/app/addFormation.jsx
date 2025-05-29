import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { SafeAreaView } from "react-native-safe-area-context";
import BottomMenu from '../components/bottomMenu';
import { useRouter } from 'expo-router';
import api from './api';

const AddFormation = ({ navigation, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: null, // { uri, type, fileName }
  });
  const [errors, setErrors] = useState({});
  const [courseId, setCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // UTILITAIRE : log complet du formData
  const logFormData = (prefix = 'formData') => {
    console.log(`===== ${prefix} ======`);
    console.log('title:', formData.title);
    console.log('description:', formData.description);
    console.log('price:', formData.price);
    console.log('thumbnail:', JSON.stringify(formData.thumbnail, null, 2));
    console.log('======================');
  };

  const updateFormData = (field, value) => {
    console.log(`> updateFormData: ${field} ←`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    console.log('> validateForm()');
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.price.trim()) newErrors.price = 'Le prix est requis';
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être un nombre valide supérieur à 0';
    }
    if (!formData.thumbnail) newErrors.thumbnail = 'L\'image de présentation est requise';

    console.log('→ Erreurs détectées:', JSON.stringify(newErrors, null, 2));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const chooseThumbnail = async () => {
    console.log('> chooseThumbnail()');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('  Permissions status:', status);

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Nous avons besoin de l\'autorisation pour accéder à vos photos.');
      console.log('  Permission refusée => on arrête chooseThumbnail.');
      return;
    }

    Alert.alert(
      'Sélectionner une image',
      'Choisissez une source',
      [
        { text: 'Annuler', style: 'cancel', onPress: () => console.log('  chooseThumbnail: Annulé par l’utilisateur') },
        {
          text: 'Galerie',
          onPress: async () => {
            try {
              console.log('  Launch image library...');
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });
              console.log('  Résultat launcher:', JSON.stringify(result, null, 2));

              if (!result.canceled && result.assets?.length > 0) {
                const asset = result.assets[0];
                console.log('  Asset sélectionné:', JSON.stringify(asset, null, 2));

                const thumbnailObj = {
                  uri: asset.uri,
                  type: asset.type === 'image' ? 'image/jpeg' : asset.type,
                  fileName: asset.fileName || `image_${Date.now()}.jpg`,
                };
                console.log('  Construire thumbnailObj =', JSON.stringify(thumbnailObj, null, 2));
                updateFormData('thumbnail', thumbnailObj);
              } else {
                console.log('  Pas de sélection, result.canceled =', result.canceled);
              }
            } catch (error) {
              console.error('  Error picking image:', error);
              Alert.alert('Erreur', 'Échec de la sélection de l\'image');
            }
          }
        },
      ]
    );
  };

  const handleSubmit = async () => {
    console.log('> handleSubmit() démarré');
    logFormData('AVANT validateForm');
    if (!validateForm()) {
      console.log('  validateForm() a renvoyé false, on arrête handleSubmit.');
      return;
    }

    logFormData('APRÈS validateForm (valide)');
    setIsLoading(true);

    try {
      // 1) Préparation des données de la formation (sans l’image)
      console.log('  1) Préparation formationData');
      const formationData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: {
          amount: parseFloat(formData.price),
          currency: "MAD"
        },
        createdAt: new Date().toISOString(),
      };
      console.log('  → formationData =', JSON.stringify(formationData, null, 2));

      // 2) Création de la formation
      let newCourseId = null;
      if (onSubmit) {
        console.log('  onSubmit prop détecté, on l’appelle');
        await onSubmit(formationData);
      } else {
        console.log('  Appel POST /api/courses', formationData);
        const courseResponse = await api.post('/api/courses', formationData, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('  Réponse creation course:', courseResponse.status, JSON.stringify(courseResponse.data, null, 2));

        newCourseId = courseResponse.data?.courseInfo.id || courseResponse.data?.id;
        console.log('  newCourseId =', newCourseId);
        setCourseId(newCourseId);
      }

      // 3) Upload du thumbnail si présent et si on a bien un courseId
      if (formData.thumbnail && newCourseId) {
        console.log('  3) Début upload thumbnail');
        logFormData('AVANT création FormData pour upload');
        console.log('  Vérification formData.thumbnail =', JSON.stringify(formData.thumbnail, null, 2));

        const imageFormData = new FormData();
        imageFormData.append('file', {
          uri: formData.thumbnail.uri,
          name: formData.thumbnail.fileName || `image_${Date.now()}.jpg`,
          type: formData.thumbnail.type || 'image/jpeg',
        });
        imageFormData.append('name', formData.title.trim());

        // Afficher les paires clé/valeur de FormData
        console.log('  Contenu imageFormData (entrée par entrée) :');
        for (let [key, value] of imageFormData.entries()) {
          console.log(`    key=${key}, value=`, value);
        }

        try {
          console.log(`  Appel POST /api/courses/${newCourseId}/upload/THUMBNAIL`);
          const imageResponse = await api.post(
            `/api/courses/${newCourseId}/upload/THUMBNAIL`,
            imageFormData,{
              headers: { 'Content-Type': 'multipart/form-data' },
            }
      
          );
          console.log('  Réponse upload image:', imageResponse.status, JSON.stringify(imageResponse.data, null, 2));

          const thumbnailUrl = imageResponse.data?.imageUrl
            || imageResponse.data?.url
            || imageResponse.data?.path;
          console.log('  thumbnailUrl reçue =', thumbnailUrl);

          if (thumbnailUrl) {
            console.log('  Mise à jour de la course avec thumbnailUrl');
            const patchResponse = await api.patch(`/api/courses/${newCourseId}`, {
              thumbnailUrl: thumbnailUrl
            });
            console.log('  Réponse patch thumbnailUrl:', patchResponse.status, JSON.stringify(patchResponse.data, null, 2));
          }
        } catch (imageError) {
          console.error('  Error uploading image:', imageError);
          if (imageError.response) {
            console.error('  Détails error.response.data =', JSON.stringify(imageError.response.data, null, 2));
          }
          Alert.alert(
            'Avertissement',
            'La formation a été créée mais l\'image n\'a pas pu être téléchargée. Vous pouvez l\'ajouter plus tard.'
          );
        }
      } else {
        console.log('  Pas d’upload thumbnail (thumbnail null ou newCourseId manquant).');
      }

      // 4) Succès final
      console.log('  Formation ajoutée avec succès.');
      Alert.alert(
        'Succès',
        'Formation ajoutée avec succès!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Réinitialisation du formulaire
              console.log('  Reset formData et erreurs');
              setFormData({
                title: '',
                description: '',
                price: '',
                thumbnail: null,
              });
              setErrors({});
              setCourseId(null);

              // Navigation arrière
              if (navigation?.goBack) {
                console.log('  Navigation goBack()');
                navigation.goBack();
              } else if (router?.back) {
                console.log('  router.back()');
                router.back();
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('  [catch] Error adding formation:', error);
      if (error.response) {
        console.error('  error.response.data =', JSON.stringify(error.response.data, null, 2));
        console.error('  error.response.status =', error.response.status);
      }
      
      let errorMessage = 'Une erreur est survenue lors de l\'ajout de la formation';
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Données invalides. Vérifiez les informations saisies.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      console.log('  Message final envoyé à l’utilisateur =', errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      console.log('  [finally] setIsLoading(false)');
      setIsLoading(false);
    }
  };

  const renderError = (field) => {
    if (errors[field]) {
      return <Text style={styles.errorText}>{errors[field]}</Text>;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.push('profFormation')}>
            <Text style={styles.header}>Ajouter une nouvelle formation</Text>
          </TouchableOpacity>
          
          {/* TITRE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Titre <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
              placeholder="Entrez le titre de la formation"
              maxLength={100}
              editable={!isLoading}
            />
            {renderError('title')}
          </View>

          {/* DESCRIPTION */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Description <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              placeholder="Décrivez votre formation en détail..."
              multiline
              numberOfLines={4}
              maxLength={500}
              editable={!isLoading}
            />
            <Text style={styles.characterCount}>
              {formData.description.length}/500 caractères
            </Text>
            {renderError('description')}
          </View>

          {/* THUMBNAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Image de présentation <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.thumbnailContainer}>
              <TouchableOpacity 
                onPress={chooseThumbnail} 
                style={[
                  styles.thumbnailBox,
                  errors.thumbnail && styles.inputError
                ]}
                disabled={isLoading}
              >
                {formData.thumbnail ? (
                  <Image source={{ uri: formData.thumbnail.uri }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.thumbnailPlaceholderContainer}>
                    <Text style={styles.thumbnailPlaceholder}>📷</Text>
                    <Text style={styles.thumbnailPlaceholderText}>Ajouter</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.thumbnailActions}>
                <TouchableOpacity 
                  onPress={chooseThumbnail} 
                  style={styles.thumbnailButton}
                  disabled={isLoading}
                >
                  <Text style={styles.thumbnailButtonText}>
                    {formData.thumbnail ? 'Changer l\'image' : 'Choisir une image'}
                  </Text>
                </TouchableOpacity>
                {formData.thumbnail && (
                  <TouchableOpacity 
                    onPress={() => {
                      console.log('  Supprimer thumbnail via bouton Supprimer');
                      updateFormData('thumbnail', null);
                    }}
                    style={[styles.thumbnailButton, styles.removeButton]}
                    disabled={isLoading}
                  >
                    <Text style={styles.removeButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {renderError('thumbnail')}
          </View>

          {/* PRIX */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Prix (MAD) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={formData.price}
              onChangeText={(value) => {
                const filtered = value.replace(/[^0-9.]/g, '');
                console.log(`  updateFormData('price', "${filtered}")`);
                updateFormData('price', filtered);
              }}
              placeholder="0.00"
              keyboardType="decimal-pad"
              editable={!isLoading}
            />
            {renderError('price')}
          </View>

          {/* BOUTON SOUMETTRE */}
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              isLoading && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={[styles.submitText, { marginLeft: 8 }]}>
                  Ajout en cours...
                </Text>
              </View>
            ) : (
              <Text style={styles.submitText}>Ajouter la formation</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
        <BottomMenu />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: '#2d3748',
    fontWeight: '600',
    fontSize: 16,
  },
  required: {
    color: '#e53e3e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e53e3e',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    color: '#718096',
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 12,
    marginTop: 4,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thumbnailBox: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#fff',
  },
  thumbnailPlaceholderContainer: {
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    fontSize: 32,
    marginBottom: 4,
  },
  thumbnailPlaceholderText: {
    fontSize: 12,
    color: '#718096',
  },
  thumbnail: {
    width: 96,
    height: 96,
    borderRadius: 10,
  },
  thumbnailActions: {
    flex: 1,
    justifyContent: 'center',
  },
  thumbnailButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  thumbnailButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#e53e3e',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2b6cb0',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AddFormation;