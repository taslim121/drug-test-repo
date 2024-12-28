import { Tabs, Redirect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '@/provider/AuthProvider';

export default function PatientLayout() {
  const { session,isHcp} = useAuth();
  if (!session || isHcp) {
    return <Redirect href={'/'} />;
  }
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="drugs-list"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name='profile-pt'
    options={{
      tabBarLabel: 'Profile',
      tabBarIcon: ({color,size}) => (
        <FontAwesome name="user" size={size} color={color} />
      )
    }
    }
    />
      <Tabs.Screen
        name="suggest-drugs" // Corrected route name
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}