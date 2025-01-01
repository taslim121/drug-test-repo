import { Tabs, Redirect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '@/provider/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PatientLayout() {
  const { session,isHcp} = useAuth();
  if (!session || isHcp) {
    return <Redirect href={'/'} />;
  }
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff' }}>
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="drugs-list"
        options={{
          tabBarLabel: 'Home',
          headerTitle: 'General Instructions',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name='profile-pt'
    options={{
      tabBarLabel: 'Profile',
      headerTitle: 'Profile',
      tabBarIcon: ({color,size}) => (
        <FontAwesome name="user" size={size} color={color} />
      )
    }
    }
    />
      <Tabs.Screen
        name="suggest-drugs" // Corrected route name
        options={{
          tabBarLabel: 'Suggestion',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}