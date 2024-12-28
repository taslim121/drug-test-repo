import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

  return (
    <View style={styles.container}>
        <Stack.Screen
            options={{
              headerTitle: `${subclassname}`,
            }}/>
      <FlatList
        data={drugs}
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
