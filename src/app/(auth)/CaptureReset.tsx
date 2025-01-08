import { View, Text, Alert, TextInput, StyleSheet } from 'react-native';
import supabase from '../../lib/supabase';
import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '../../provider/AuthProvider';



const CaptureReset = () => {
  const router = useRouter();
  const { restoreSession, setResetPending, resetPending } = useAuth();

  useEffect(() => {
    async function extractTokensAndRestoreSession() {
      let params = new URLSearchParams(window.location.hash.substring(1));
      let access_token = params.get('access_token');
      let refresh_token = params.get('refresh_token');

      if (!access_token || !refresh_token) {
        params = new URLSearchParams(window.location.search);
        access_token = params.get('access_token');
        refresh_token = params.get('refresh_token');
      }

      if (access_token && refresh_token) {
        setResetPending(true);
        await restoreSession({ access_token, refresh_token });
      } else {
        Alert.alert('Error', 'Missing tokens. Try resetting your password again.');
        router.replace('/sign-in');
      }
    }

    extractTokensAndRestoreSession();
  }, []);

  useEffect(() => {
    console.log("Reset Pending:", resetPending);
    if (resetPending) {
      router.push('/updatepass');
    }
  }, [resetPending]);

  return (
    <View>
      <Text>Processing Reset...</Text>
    </View>
  );
};
export default CaptureReset;