import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme,Platform } from "react-native"
import AuthProvider from '@/provider/AuthProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
      SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
  
    
  return (
    
     <AuthProvider>
    <Stack>
      
       <Stack.Screen name="(auth)" options={{ headerShown: false }} />
       <Stack.Screen name="(pt)" options={{ headerShown: false }} />
       <Stack.Screen 
      name="(hcp)" 
      options={{ 
        headerShown: Platform.OS === 'ios', 
        headerTitle: Platform.OS === 'ios' ? 'HealthCare Prof.' : undefined 
      }} 
       />
       <Stack.Screen name="(admin)" options={{ headerShown: false }} />
       <Stack.Screen name="drug-details/[id]" options={{ headerShown: true }} />
       <Stack.Screen name="drugs/[sub_class_id]" options={{ headerShown: true }} />
       <Stack.Screen name="sub-classes/[class_id]" options={{ headerShown: true }} />
       <Stack.Screen name="+not-found" />
     </Stack>
     </AuthProvider>
    
  );
}
