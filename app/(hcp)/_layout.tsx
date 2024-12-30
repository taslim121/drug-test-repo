
import { Tabs ,Stack,Redirect} from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '@/provider/AuthProvider';

export default function HcpLayout() {
  const {session,isPatient} = useAuth();
  if(!session || isPatient){
    return <Redirect href={'/'} />;
  }
  return (
    <Tabs screenOptions={{headerShown:false}}>
      
      
    <Tabs.Screen name="hcp_home"
     options={{
      tabBarLabel: 'Drugs',
      tabBarIcon: ({color,size}) => (
        <FontAwesome name="home" size={size} color={color} />
      )

     }}  />
     <Tabs.Screen name='profile-hcp'
    options={{
      tabBarLabel: 'Profile',
      tabBarIcon: ({color,size}) => (
        <FontAwesome name="user" size={size} color={color} />
      )
    }
    }
    />
    <Tabs.Screen name='suggest-hcp'
    options={{
      tabBarLabel: 'Suggestions',
      tabBarIcon: ({color,size}) => (
        <FontAwesome name="search" size={size} color={color} />
      )
    }
    }
    />
    </Tabs>
  );
}
