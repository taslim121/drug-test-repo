import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

type Class = {
  class_id: number;
  class_name: string;
};

const CACHE_KEY = 'classes';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const ClassList = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        const cachedTimestamp = await AsyncStorage.getItem(`${CACHE_KEY}_timestamp`);
        const now = Date.now();

        if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp) < CACHE_DURATION) {
          setClasses(JSON.parse(cachedData));
          setLoading(false);
        } else {
          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('*')
            .order('class_name', { ascending: true });

          if (classError) {
            console.error(classError);
            setLoading(false);
            return;
          }

          setClasses(classData || []);
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(classData));
          await AsyncStorage.setItem(`${CACHE_KEY}_timestamp`, now.toString());
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(cls =>
    cls.class_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Class List</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by class name"
          value={filter}
          onChangeText={setFilter}
        />
        {filter.length > 0 && (
          <TouchableOpacity onPress={() => setFilter('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredClasses}
          keyExtractor={(item) => item.class_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: `/sub-classes/[class_id]`, params: { class_id: item.class_id.toString(), classname: item.class_name } })}
            >
              <Text style={styles.className}>{item.class_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  className: {
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

export default ClassList;
