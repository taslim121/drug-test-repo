// screens/DrugList.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

type Drug = {
  drug_id: number;
  drug_name: string;
};

type DrugListProps = {
  filter: string;
};

const DrugList: React.FC<DrugListProps> = ({ filter }) => {
  const router = useRouter();
  const [drugs, setDrugs] = useState<Drug[]>([]);
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
      const storedDrugs = await AsyncStorage.getItem('drugs');
      if (storedDrugs) {
        setDrugs(JSON.parse(storedDrugs));
        setLoading(false);
      } else {
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
      <FlatList
        data={filteredDrugs}
        keyExtractor={(item) => item.drug_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: `/drug-details/[id]`, params: { id: item.drug_id.toString(), name: item.drug_name } })}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DrugList;
