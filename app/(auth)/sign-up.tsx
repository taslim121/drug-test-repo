import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import { Link, Stack } from 'expo-router';
import {Picker} from '@react-native-picker/picker';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Colors from '../../constant/Colors';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign up' }} />

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="John Doe"
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.label}>Role</Text>
    <Picker
      selectedValue={role}
      onValueChange={(itemValue: string) => setRole(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="Patient" value="patient" />
      <Picker.Item label="Health Care Professional" value="hcp" />
    </Picker>

      <Button text={loading ? 'Creating account...' : 'Create account'} onPress={signUpWithEmail} disabled={loading} />
      <Link href="/sign-in" style={styles.textButton}>
        Sign in
      </Link>
    </View>
  );
};

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
  },
  picker:{
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 20,
  },

  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
});
export default SignUpScreen;