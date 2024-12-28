import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

const DrugDetails: React.FC = () => {
  const { id, name } = useLocalSearchParams<{ id: string, name: string }>();
  const [drugDetails, setDrugDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

  const fetchDrugDetails = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('drug_id', id);

    if (error) {
      console.error(error);
    } else {
      setDrugDetails(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchDrugDetails();
  }, [fetchDrugDetails]);

  const toggleExpansion = (index: number) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [index]: !prevExpandedItems[index],
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const hasFoodInteractions = drugDetails.some(item => item.food !== 'NA');

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Food Interaction</Text>
      </View>
      <View style={styles.drugInfo}>
        <Text style={styles.cardTitle}>Drug Name: {name}</Text>
      </View>
      {hasFoodInteractions && (
        <View style={styles.foodListHeader}>
          <Text style={styles.foodListHeaderText}>Food List</Text>
        </View>
      )}
      <FlatList
        data={drugDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            {item.food === 'NA' ? (
              <Text style={styles.cardTitle}>No Drug Food Interaction Available</Text>
            ) : (
              <TouchableOpacity onPress={() => toggleExpansion(index)}>
                <Text style={styles.cardTitle}>{item.food}</Text>
              </TouchableOpacity>
            )}
            {expandedItems[index] && item.food !== 'NA' && (
              <>
                <Text style={styles.cardsubTitle}>Mechanisms of Action:</Text>
                <Text style={styles.cardText}>{item.mechanism_of_action}</Text>
                <Text style={styles.cardsubTitle}>Severity:</Text>
                <Text style={styles.cardText}>{item.severity}</Text>
                <Text style={styles.cardsubTitle}>Management:</Text>
                <Text style={styles.cardText}>{item.management}</Text>
                <Text style={styles.cardsubTitle}>Reference:</Text>
                <TouchableOpacity onPress={() => Linking.openURL(item.reference)}>
                  <Text style={styles.linkText}>{item.reference}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'lightseagreen',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  drugInfo: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  foodListHeader: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  foodListHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardsubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  linkText: {
    fontSize: 16,
    color: '#6200ee',
    textDecorationLine: 'underline',
  },
});

export default DrugDetails;
