import { View, Text, Alert, TextInput, StyleSheet } from 'react-native';
import supabase from '../../lib/supabase';
import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '../../provider/AuthProvider';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);
  const router = useRouter();
  const { restoreSession } = useAuth();

  useEffect(() => {
    function extractTokens() {
      let params = new URLSearchParams(window.location.hash.substring(1));
      let access_token = params.get('access_token');
      let refresh_token = params.get('refresh_token');

      if (!access_token || !refresh_token) {
        console.log('Tokens not found in hash, checking query params...');
        params = new URLSearchParams(window.location.search);
        access_token = params.get('access_token');
        refresh_token = params.get('refresh_token');
      }

      console.log('Extracted Tokens:', { access_token, refresh_token });

      if (access_token && refresh_token) {
        restoreSession({ access_token, refresh_token })
          .then(() => {
            console.log('Session restored successfully.');
            setSessionRestored(true);
          })
          .catch((error) => {
            console.error('Session restore failed:', error);
            Alert.alert('Session Error', 'Failed to authenticate. Try resetting again.');
            router.replace('/sign-in');
          });
      } else {
        Alert.alert('Error', 'Missing tokens. Try resetting your password again.');
        router.replace('/sign-in');
      }
    }

    extractTokens();
  }, []);

  // Handle password update
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

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password updated successfully! Please log in again.');
      console.log('Success', 'Password updated successfully! Please log in again.')
      await supabase.auth.signOut();
      router.replace('/sign-in');
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>New Password</Text>
      {sessionRestored ? (
        <>
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
        </>
      ) : (
        <Text>Authenticating...</Text>
      )}
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
