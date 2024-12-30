import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

type Drug = {
  drug_id: number;
  drug_name: string;
};

const DrugList = () => {
  const router = useRouter();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDrugsFromDatabase = async () => {
    try {
      const { data: drugData, error: drugError } = await supabase
        .from('drugs')
        .select('*')
        .order('drug_name', { ascending: true });

      if (drugError) {
        console.error(drugError);
        return;
      }

      // Store data in AsyncStorage
      await AsyncStorage.setItem('drugs', JSON.stringify(drugData));
      setDrugs(drugData || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDrugs = async () => {
    try {
      // Try to load from AsyncStorage
      const storedDrugs = await AsyncStorage.getItem('drugs');
      if (storedDrugs) {
        setDrugs(JSON.parse(storedDrugs));
        setLoading(false);
      } else {
        // If not found in AsyncStorage, fetch from database
        await fetchDrugsFromDatabase();
      }
    } catch (error) {
      console.error('Error loading drugs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrugs();
  }, []);

  const filteredDrugs = drugs.filter(drug =>
    drug.drug_name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Drugs List</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by drug name"
          value={filter}
          onChangeText={setFilter}
        />
        {filter.length > 0 && (
          <TouchableOpacity onPress={() => setFilter('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={filteredDrugs}
        keyExtractor={(item) => item.drug_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({ pathname: `/drug-details/[id]`, params: { id: item.drug_id.toString(), name: item.drug_name } })
            }
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: '90%',
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  clearButton: {
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 8,
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DrugList;
