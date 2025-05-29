import { router } from 'expo-router';
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Dimensions,
  Platform 
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SelectRole = () => {

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={false}
      />
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sélectionnez votre rôle</Text>
          <Text style={styles.subtitle}>
            Choisissez le profil qui correspond à votre utilisation
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.studentButton]}
            activeOpacity={0.8}
            accessibilityLabel="Sélectionner le rôle étudiant"
            accessibilityHint="Accède aux fonctionnalités pour les étudiants"
            onPress={()=>{router.push('./loginStudent')}}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.roleIcon}>🎓</Text>
              <Text style={styles.buttonText}>Étudiant</Text>
              <Text style={styles.buttonDescription}>
                Accédez aux cours et ressources pédagogiques
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.teacherButton]}
            activeOpacity={0.8}
            accessibilityLabel="Sélectionner le rôle enseignant"
            accessibilityHint="Accède aux fonctionnalités pour les enseignants"
            onPress={()=>{router.push('./loginProf')}}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.roleIcon}>👨‍🏫</Text>
              <Text style={styles.buttonText}>Enseignant</Text>
              <Text style={styles.buttonDescription}>
                Gérez vos cours 
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000066',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: width * 0.8,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 16,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  studentButton: {
    backgroundColor: '#000066',
  },
  teacherButton: {
    backgroundColor: '#33A9FF',
  },
  buttonContent: {
    alignItems: 'center',
    width: '100%',
  },
  roleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 240,
  },
});

export default SelectRole;