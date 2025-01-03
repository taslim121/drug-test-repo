import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

type Product = {
  id: number;
  drug: string;
};
import { useRouter } from 'expo-router';
import supabase from '../../lib/supabase';
import { useEffect, useState } from 'react';
import React from 'react'
import SearchBar from '../../components/Searchbar';
import { useQuery } from '@tanstack/react-query';

const Drugs = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('');
  const {data : Drugs, isLoading, error } = useQuery<Product[]>({
    queryKey: ['general_instructions'],
    queryFn: async () => {
      const { data , error } =  await supabase
              .from('general_instructions')
              .select('id,drug')
              .order('drug', { ascending: true });
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
    drug.drug.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>General Instructions</Text>
      <SearchBar filter={filter} setFilter={setFilter} />
      <FlatList
        data={filteredDrugs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: `/patient_dynamic/drugs-pt/[id]`, params: { id: item.id.toString(), name: item.drug } })}
          >
            <Text style={styles.drugName}>{item.drug}</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
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


export default Drugs;