import React, { useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import supabase from '../app/lib/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery } from '@tanstack/react-query';
import parseAndRenderText from '../utils/parsehttp';

interface InteractionBase {
  food: string;
  management?: string;
  counselling_tips?: string;
  mechanism_of_action?: string;
  severity?: string;
  reference?: string;
}

interface Interaction extends InteractionBase {
  drug_id: string;
  isCounsellingTips?: boolean;
}

interface DrugInteractionListProps {
  tableName: 'interactions' | 'patient_interactions';
}

const DrugInteractionList: React.FC<DrugInteractionListProps> = ({ tableName }) => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

  // Fetch data
  const { data: drugDetails, isLoading, error } = useQuery<Interaction[]>({
    queryKey: [tableName, id],
    queryFn: async () => {
      const { data, error } = await supabase.from(tableName).select('*').eq('drug_id', id);
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  if (isLoading) return <ActivityIndicator style={styles.loadingContainer} size="large" color="#000" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const toggleExpansion = (index: number) => {
    setExpandedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Include counselling tips only in patient_interactions
  const dataWithCounsellingTips = tableName === 'patient_interactions' && drugDetails?.[0]?.food !== 'NA'
    ? drugDetails && [
        ...drugDetails,
        { 
          drug_id: id, 
          food: '', 
          counselling_tips: drugDetails[0]?.counselling_tips, 
          isCounsellingTips: true 
        },
      ]
    : drugDetails;

  const renderInteractionItem = ({ item, index }: { item: Interaction; index: number }) => {
    const isExpanded = expandedItems[index];

    return (
      <View style={styles.card}>
        {/* Handle food == "NA" separately for patient_interactions */}
        {item.food === 'NA' ? (
          <>
            <Text style={styles.cardTitle}>No Drug Food Interaction Available</Text>
            {tableName === 'patient_interactions' && item.counselling_tips && (
              <View style={styles.expandedContent}>
                <Text style={styles.bold}>Counselling Tips:</Text>
                <Text style={styles.cardText}>{item.counselling_tips}</Text>
              </View>
            )}
          </>
        ) : item.isCounsellingTips ? (
          <>
            {/* Counselling Tips Section for patient_interactions */}
            <Text style={styles.bold}>Counselling Tips:</Text>
            <Text style={styles.cardText}>{item.counselling_tips}</Text>
          </>
        ) : (
          <>
            {/* Food Interaction Header */}
            <TouchableOpacity style={styles.touch} onPress={() => toggleExpansion(index)}>
              <Text style={styles.cardTitle}>{item.food}</Text>
              <FontAwesome
                name="chevron-right"
                size={15}
                color="black"
                style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {/* Collapsible Details */}
            {isExpanded && (
              <View style={styles.expandedContent}>
                {item.mechanism_of_action && (
                  <Text style={styles.cardText}>
                    <Text style={styles.bold}>Mechanism:</Text> {item.mechanism_of_action}
                  </Text>
                )}
                {item.severity && (
                  <Text style={styles.cardText}>
                    <Text style={styles.bold}>Severity:</Text> {item.severity}
                  </Text>
                )}
                {item.management && (
                  <Text style={styles.cardText}>
                    <Text style={styles.bold}>Management:</Text> {item.management}
                  </Text>
                )}
                {item.reference && (
                  <View>
                    <Text style={styles.bold}>Reference:</Text>
                    {parseAndRenderText(item.reference)}
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Food Interaction',
          headerStyle: { backgroundColor: '#0a7ea4' },
          headerTintColor: '#fff',
        }}
      />

      <View style={styles.drugInfo}>
        <Text style={styles.cardTitle}>Drug Name: {name}</Text>
      </View>

      <FlatList
        data={dataWithCounsellingTips}
        keyExtractor={(item, index) => `${item.drug_id}-${item.food}-${index}`}
        renderItem={renderInteractionItem}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    ...Platform.select({ ios: { marginTop: 38 } }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drugInfo: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  expandedContent: {
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: 'black',
    paddingTop: 5,
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default DrugInteractionList;
