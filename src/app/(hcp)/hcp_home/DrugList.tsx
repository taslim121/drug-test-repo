// screens/DrugList.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../../../lib/supabase';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

type Drug = {
  drug_id: number;
  drug_name: string;
};

type DrugListProps = {
  filter: string;
};

const DrugList: React.FC<DrugListProps> = ({ filter }) => {
  const router = useRouter();

  const {data : Drugs, isLoading, error } = useQuery<Drug[]>({
      queryKey: ['drugs'],
      queryFn: async () => {
        const { data , error } =  await supabase
                .from('drugs')
                .select('*')
                .order('drug_name', { ascending: true });
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
    if(isLoading){
      return <ActivityIndicator style={styles.loadingContainer} size="large" color="#000" />;
    }
    if(error){
      return <Text>Error: {error.message}</Text>;
    }
  
  

  const filteredDrugs = Drugs?.filter(drug =>
    drug.drug_name.toLowerCase().includes(filter.toLowerCase())
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDrugs}
        keyExtractor={(item) => item.drug_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: `/hcp_dynamic/drug-details/[id]`, params: { id: item.drug_id.toString(), name: item.drug_name } })}
          >
            <Text style={styles.drugName}>{item.drug_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drugName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DrugList;
