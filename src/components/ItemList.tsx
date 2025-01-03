// components/ItemList.tsx
import React from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type Item = {
  id: number;
  name: string;
};

type ItemListProps = {
  items: Item[];
  filter: string;
  onFilterChange: (text: string) => void;
  onClearFilter: () => void;
  onPressItem: (item: Item) => void;
  headerTitle: string;
  placeholder: string;
};

const ItemList = ({
  items,
  filter,
  onFilterChange,
  onClearFilter,
  onPressItem,
  headerTitle,
  placeholder
}: ItemListProps) => {
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{headerTitle}</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder={placeholder}
          value={filter}
          onChangeText={onFilterChange}
        />
        {filter.length > 0 && (
          <TouchableOpacity onPress={onClearFilter} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onPressItem(item)}>
            <Text style={styles.itemName}>{item.name}</Text>
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
  itemName: {
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

export default ItemList;
