import { View, Text, Alert, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import supabase from '../../lib/supabase';
import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../provider/AuthProvider'; // Import AuthProvider for session checking

const UpdatePasswordScreen = () => {
  const { session, loading: authLoading } = useAuth(); // Check if user is authenticated
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useLocalSearchParams(); 

  useEffect(() => {
    if (token) {
      restoreSession();
    }
  }, [token]);

  async function restoreSession() {
    if (!token) {
      Alert.alert('Session Error', 'Invalid session token.');
      router.replace('/sign-in');
      return;
    }
    console.log(token);
    const { data, error } = await supabase.auth.setSession({
      access_token: Array.isArray(token) ? token[0] : token,
      refresh_token: Array.isArray(token) ? token[0] : token,
    });

    if (error) {
      Alert.alert('Session Error', 'Failed to authenticate. Try resetting again.');
      router.replace('/sign-in');
    }
    console.log(data);
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

    if (!session) {
      Alert.alert('Error', 'User is not authenticated. Please sign in again.');
      router.replace('/sign-in');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password updated successfully! You can now sign in.');
      router.replace('/sign-in'); // Redirect to login
    }

    setLoading(false);
  }

  // Redirect unauthorized users (only if session check is completed)
  useEffect(() => {
    if (!authLoading && !session) {
      Alert.alert('Unauthorized', 'You need to sign in first.');
      router.replace('/sign-in');
    }
  }, [session, authLoading]);

  if (authLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UpdatePasswordScreen;
