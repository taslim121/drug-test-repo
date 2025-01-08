import { View, Text,Alert,AppState, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import supabase from '../../lib/supabase';
import React, { useState } from 'react';
import Button from '../../components/Button';
import { Stack,useRouter } from 'expo-router';

const resetpass = () => {
    const [email, setEmail] = useState('');
    const router = useRouter();
    const [loading,setLoading] = useState(false);

    async function resetPassword() {
        if (!email) {
          Alert.alert('Error', 'Please enter your email to reset password.');
          return;
        }
         setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email);
    
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          setLoading(false);
          Alert.alert('Success', 'A password reset link has been sent to your email. PLEASE confirm that and then update the new password');
        }
    }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{headerTransparent:false , title: 'Reset Password', headerStyle:{ backgroundColor: '#0a7ea4'}, headerTintColor: '#fff' }} />
      <Text style={styles.label}>Email For reset Password </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        style={styles.input}
      />

    <Button
        text={loading ? 'Sending...' : 'Send Reset Link'}
        onPress={resetPassword}
    />
     
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  }
});
export default resetpass;