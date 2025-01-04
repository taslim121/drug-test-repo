import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDrugs } from '../../../provider/DrugsProvider';
import { FontAwesome } from '@expo/vector-icons';
import { usePaginatedDrugs } from '../../../components/hooks/usePaginatedDrugs';

const DrugList: React.FC<{ filter: string }> = ({ filter }) => {
  const router = useRouter();
  const { selectedDrugs, onAddDrug, onRemoveDrug } = useDrugs();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePaginatedDrugs();

  const drugs = data?.pages.flatMap((page) => page.data) || [];

  const filteredDrugs = drugs.filter((drug) =>
    drug.drug_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDrugs}
        keyExtractor={(item) => item.drug_id.toString()}
        getItemLayout={(data, index) => ({
          length: 70,
          offset: 70 * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews={true}
        renderItem={({ item }) => {
          const isSelected = selectedDrugs.some((drug) => drug.drug_id === item.drug_id);
          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={{ width: '85%' }}
                onPress={() =>
                  router.push({
                    pathname: `/hcp_dynamic/drug-details/[id]`,
                    params: { id: item.drug_id.toString(), name: item.drug_name },
                  })
                }
              >
                <Text style={styles.drugName}>{item.drug_name}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => (isSelected ? onRemoveDrug(item.drug_id) : onAddDrug(item))}
              >
                <FontAwesome
                  name={isSelected ? 'minus-circle' : 'plus-circle'}
                  size={20}
                  color={isSelected ? 'red' : 'green'}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5} // Load more when scrolled 50%
        ListFooterComponent={() =>
          isFetchingNextPage ? <ActivityIndicator size="small" color="#000" /> : null
        }
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
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 8,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#0a7ea4',
  },
  addButton: {
    padding: 5,
    width: '15%',
  },
});

export default DrugList;
