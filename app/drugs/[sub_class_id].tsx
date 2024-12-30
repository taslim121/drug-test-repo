import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TextInput,TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter,useLocalSearchParams,Stack} from 'expo-router';
import { supabase } from '@/lib/supabase';

type Drug = {
  drug_id: number;
  drug_name: string;
};

const DrugList = () => {
  const router = useRouter();
  const { sub_class_id ,subclassname} = useLocalSearchParams<{ sub_class_id: string,subclassname : string }>();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const { data: drugData, error: drugError } = await supabase
          .from('drugs')
          .select('*')
          .eq('subclass_id', sub_class_id)
          .order('drug_name', { ascending: true });

        if (drugError) {
          console.error(drugError);
          return;
        }

        setDrugs(drugData || []);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchDrugs();
  }, [sub_class_id]);

  const filteredDrugs = drugs.filter(drug =>
    drug.drug_name.toLowerCase().includes(filter.toLowerCase())
  );


  return (
    <View style={styles.container}>
        <Stack.Screen
                options={{
                  headerTransparent: true,
                  headerTitle: '',
                }}
              />
              <View style={styles.header}>
                <Text style={styles.headerText}>Subclass : {subclassname}</Text>
              </View> 
        <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchBar}
                  placeholder="Search"
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
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'lightseagreen',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: '#fff',
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
    marginTop: 10,
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
});

export default DrugList;