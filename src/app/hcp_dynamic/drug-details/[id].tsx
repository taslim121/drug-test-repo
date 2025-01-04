import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Stack, useLocalSearchParams,Redirect } from 'expo-router';
import supabase from '../../../lib/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../provider/AuthProvider';
import parseAndRenderText from '../../../utils/parsehttp';
const DrugDetails: React.FC = () => {

  const {session,isPatient} = useAuth();
    if(!session || isPatient){
      return <Redirect href={'/'} />;
    }
  const { id, name } = useLocalSearchParams<{ id: string, name: string }>();
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});
  const {data : drugDetails, isLoading, error } = useQuery<any[]>({
    queryKey: ['interactions',id],
    queryFn: async () => {
      const { data , error } =  await supabase
              .from('interactions')
              .select('*')
              .eq('drug_id',id)
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
  if(isLoading){
    return <ActivityIndicator style={styles.loadingContainer} size="large" color="#000" />;
  }
  if(error){
    return <Text>Error: {error.message}</Text>;
  }

  const toggleExpansion = (index: number) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [index]: !prevExpandedItems[index],
    }));
  };



  const hasFoodInteractions = drugDetails?.some(item => item.food !== 'NA');

  return (
    <View style={styles.container}>
      <Stack.Screen options={{headerTransparent:false , title: 'Food Interaction', headerStyle:{ backgroundColor: '#0a7ea4'}, headerTintColor: '#fff' }} />
      
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
              <TouchableOpacity style={styles.touch} onPress={() => toggleExpansion(index)}>
                <Text style={styles.cardTitle}>{item.food}</Text>
                
                <FontAwesome name="chevron-right" size={15} color="black" style={{ transform: [{ rotate: expandedItems[index] ? '90deg' : '0deg' }] }}/>
              </TouchableOpacity>
            )}
            {expandedItems[index] && item.food !== 'NA' && (
              <>
                <View style={{borderBottomColor: 'black', borderBottomWidth: 1, marginBottom : 3}} />
                {item.mechanism_of_action?(
                  <View>
                    <Text style={styles.cardsubTitle}>Mechanisms of Action:</Text>
                    <Text style={styles.cardText}>{item.mechanism_of_action}</Text>
                  </View>
                ):null}
                {item.severity?(
                  <View>
                    <Text style={styles.cardsubTitle}>Severity:</Text>
                    <Text style={styles.cardText}>{item.severity}</Text>
                  </View>
                ):null}{item.management?(
                  <View>
                    <Text style={styles.cardsubTitle}>Management:</Text>
                    <Text style={styles.cardText}>{item.management}</Text>
                  </View>
                ):null}{item.reference?(
                  <View>
                    <Text style={styles.cardsubTitle}>Reference:</Text>
                    <View>{parseAndRenderText(item.reference)}</View>
                  </View>
                ):null}
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
    ...Platform.select({
      ios: {
        marginTop:38
      },
      android: {
        
      },
    }),
    
    
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
  arrow: {
    fontSize: 25,
    color: '#000',
    width: 25,
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default DrugDetails;
