import { View, Text, Alert, TextInput, StyleSheet } from 'react-native';
import supabase from '../../lib/supabase';
import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { token } = useLocalSearchParams(); // Capture the session token from URL

  useEffect(() => {
    if (token) {
      console.log(token);
      restoreSession();
    }
  }, [token]);

  async function restoreSession() {
    const { error } = await supabase.auth.setSession({ access_token: Array.isArray(token) ? token[0] : token, refresh_token: '' });

    if (error) {
      Alert.alert('Session Error', 'Failed to authenticate. Try resetting again.');
      router.replace('/sign-in');
    }
  }

  async function updatePassword() {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ 
      email,
      password 
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password updated successfully! You can now sign in.');
      router.replace('/sign-in'); // Redirect to login
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email For reset Password </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="jon@gmail.com"
              style={styles.input}
            />
      <Text style={styles.label}>New Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter new password"
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
        style={styles.input}
        secureTextEntry
      />

      <Button text={loading ? 'Updating...' : 'Update Password'} onPress={updatePassword} disabled={loading} />
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
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

export default ResetPasswordScreen;
