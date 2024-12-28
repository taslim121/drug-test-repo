import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';

type Drug = {
  drug_id: number;
  drug_name: string;
};

type Interaction = {
  interaction_id: number;
  drug_id: number;
  food: string;
  severity: string;
  mechanism_of_action: string;
  reference: string;
  management: string;
};

const DrugList = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [filter, setFilter] = useState('');
  const [expandedDrugId, setExpandedDrugId] = useState<number | null>(null);
  const [interactionDetails, setInteractionDetails] = useState<Record<number, Interaction[]>>({});

  useEffect(() => {
    const fetchDrugsAndInteractions = async () => {
      try {
        let { data: drugData, error: drugError } = await supabase
          .from('drugs')
          .select('*')
          .order('drug_name', { ascending: true });

        if (drugError) {
          console.error(drugError);
          return;
        }

        const drugIds = drugData ? drugData.map(drug => drug.drug_id) : [];
        let { data: interactionData, error: interactionError } = await supabase
          .from('interactions')
          .select('*')
          .in('drug_id', drugIds);

        if (interactionError) {
          console.error(interactionError);
          return;
        }

        const interactionDetailsMap = (interactionData || []).reduce((acc: Record<number, Interaction[]>, interaction: Interaction) => {
          if (!acc[interaction.drug_id]) {
            acc[interaction.drug_id] = [];
          }
          acc[interaction.drug_id].push(interaction);
          return acc;
        }, {});

        setDrugs(drugData || []);
        setInteractionDetails(interactionDetailsMap);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchDrugsAndInteractions();
  }, []);

  const toggleDrugDetails = (drugId: number) => {
    setExpandedDrugId(expandedDrugId === drugId ? null : drugId);
  };

  const filteredDrugs = drugs.filter(drug =>
    drug.drug_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by drug name"
        value={filter}
        onChangeText={setFilter}
      />
      <FlatList
        data={filteredDrugs}
        keyExtractor={(item) => item.drug_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.drugItem}>
            <TouchableOpacity onPress={() => toggleDrugDetails(item.drug_id)}>
              <Text style={styles.drugName}>{item.drug_name}</Text>
            </TouchableOpacity>
            {expandedDrugId === item.drug_id && interactionDetails[item.drug_id] && (
              <View style={styles.drugDetails}>
                {interactionDetails[item.drug_id].map((interaction) => (
                  <View key={interaction.interaction_id} style={styles.interactionItem}>
                    <Text style={styles.detailHeading}>Interaction Food:</Text>
                    <Text>{interaction.food}</Text>
                    <Text style={styles.detailHeading}>Mechanism of Action:</Text>
                    <Text>{interaction.mechanism_of_action}</Text>
                    <Text style={styles.detailHeading}>Interactions Severity:</Text>
                    <Text>{interaction.severity}</Text>
                    <Text style={styles.detailHeading}>Management:</Text>
                    <Text>{interaction.management}</Text>
                    <Text style={styles.detailHeading}>Refrences:</Text>
                    <Text>{interaction.reference}</Text>
                  </View>
                ))}
              </View>
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
    padding: 16,
    backgroundColor: '#fff',
    maxWidth: '100%'
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  drugItem: {
    marginBottom: 16,
  },
  drugName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drugDetails: {
    marginTop: 8,
    paddingLeft: 16,
  },
  interactionItem: {
    marginBottom: 16,
  },
  detailHeading: {
    fontWeight: 'bold',
  },
});

export default DrugList;