// screens/ClassList.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

type Class = {
  class_id: number;
  class_name: string;
};

type ClassListProps = {
  filter: string;
};

const ClassList: React.FC<ClassListProps> = ({ filter }) => {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
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
        setLoading(false);
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredClasses}
          keyExtractor={(item) => item.class_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: `/hcp_dynamic/sub-classes/[class_id]`, params: { class_id: item.class_id.toString(), classname: item.class_name } })}
              activeOpacity={0.7}
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
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default ClassList;
