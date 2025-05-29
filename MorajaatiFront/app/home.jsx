import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';

const Home = () => {
  const nav = useNavigation()
  return(
    <Pressable onPress={()=>nav.navigate('ListCourses')}>
      <SafeAreaView style = {styles.container}>
        <View style = {styles.content}>
          <Text style = {styles.title}>
            Welcome Smayka
          </Text>
        </View>
      </SafeAreaView>
    </Pressable>
  )
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});