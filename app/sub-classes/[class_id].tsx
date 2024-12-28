import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter,useLocalSearchParams,Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';

type SubClass = {
  sub_class_id: number;
  name: string;
};

const SubClassList = () => {
  const router = useRouter();
  const { class_id,classname } = useLocalSearchParams<{ class_id: string,classname: string }>();
  const [subClasses, setSubClasses] = useState<SubClass[]>([]);

  useEffect(() => {
    const fetchSubClasses = async () => {
      try {
        const { data: subClassData, error: subClassError } = await supabase
          .from('sub_classes')
          .select('*')
          .eq('class_id', class_id)
          .order('name', { ascending: true });

        if (subClassError) {
          console.error(subClassError);
          return;
        }

        setSubClasses(subClassData || []);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchSubClasses();
  }, [class_id]);

  return (
    <View style={styles.container}>
        <Stack.Screen
            options={{
              headerTitle: `${classname}`,
            }}
          />
      <FlatList
        data={subClasses}
        keyExtractor={(item) => item.sub_class_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: `/drugs/[sub_class_id]`, params: { sub_class_id: item.sub_class_id.toString(), subclassname : item.name } })}
          >
            <Text style={styles.subClassName}>{item.name}</Text>
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
  subClassName: {
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

export default SubClassList;
