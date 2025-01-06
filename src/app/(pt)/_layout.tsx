import { Tabs, Redirect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../../provider/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import headerRight from '../../utils/headerRight';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function PatientLayout() {
  const { session,isHcp} = useAuth();
  if (!session || isHcp) {
    return <Redirect href={'/'} />;
  }
  return (
    
    <Tabs screenOptions={{ headerShown: false ,tabBarActiveTintColor: 'black',tabBarInactiveTintColor: 'gray',tabBarShowLabel: true,}}>
       <Tabs.Screen name='pt_home'
    options={{
      tabBarLabel: 'Drugs',
      headerShown: true,
          headerTitle: '',
          headerStyle: {
            height: 70,
          },
          headerRight: headerRight,
      
      tabBarIcon: ({color,size}) => (
        <FontAwesome name="home" size={size} color={color} />
      )
    }
    }
    />
    <Tabs.Screen
        name="pt_food_search"
        options={{
          tabBarLabel: 'Food-Search',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="food-bank" size={size} color={color} />,
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
          tabBarLabel: 'Suggestion',
         
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
   
  );
}