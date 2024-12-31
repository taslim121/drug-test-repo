import { View, Text,StyleSheet, Button,TouchableOpacity} from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router';


const main = () => {
    const router = useRouter();
  return (
    <View>
      <Stack.Screen options={{headerTransparent:true,headerTitle:''}}/>
      <View style={styles.container}>
        <Text style={styles.text}>
            Your Ultimate
            <Text style={{color : 'purple' }}> Drug Interaction </Text>
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
    btn:{
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 20,
        marginVertical: 20,
          
    }
})