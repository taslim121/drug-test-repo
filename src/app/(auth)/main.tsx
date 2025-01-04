import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router';


const main = () => {
  const router = useRouter();
  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Stack.Screen options={{ headerTransparent: true, headerTitle: '' }} />
      <View style={styles.container}>
        <Image source={require('../../assets/images/drugSpec.webp')} style={{ width: 270, height: 200, alignSelf: 'center', marginBottom: 10, resizeMode: 'contain' }} />
        <Text style={styles.text}>
          Your Ultimate
          <Text style={{ color: '#0a7ea4' }}> Drug Interaction </Text>
          App
        </Text>
        <Text style={styles.text1}>
          Find Your Drugs and Their Interactions
        </Text>
      </View>
      <View>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/sign-in')} >
          <Text style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default main;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
    
  },
  text: {
    fontFamily: 'outfit-bold',
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
  },
  text1: {
    fontFamily: 'outfit',
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: 'darkgray',
  },
  btn: {
    backgroundColor: '#0a7ea4',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 20,

  }
})