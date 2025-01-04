import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../provider/AuthProvider';

const SelectedDrugsButton: React.FC = () => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push({ pathname: '/SelectedDrugs/Selectedrugs' })}>
      {({ pressed }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 15,
            paddingVertical: 2,
            paddingHorizontal: 6,
            backgroundColor: pressed ? '#e0f7fa' : '#ffffff',
            borderRadius: 8,
            elevation: 2,
            borderWidth: 1,
            borderColor: 'gray',
          }}
        >
          <FontAwesome name="list-alt" size={18} color={'#0a7ea4'} />
          <View style={{ marginLeft: 5 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0a7ea4' }}>Selected</Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0a7ea4' }}>Drugs</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default SelectedDrugsButton;
