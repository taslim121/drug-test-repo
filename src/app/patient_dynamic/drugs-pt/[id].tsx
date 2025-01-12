import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Linking, Image, Platform } from 'react-native';
import { Stack, useLocalSearchParams, Redirect } from 'expo-router';
import supabase from '../../lib/supabase';
import { useQuery } from '@tanstack/react-query';

type Product = {
  instructions: string;
  references: string;
  image_path: string;
};

const fetchImageUrl = (path: string) => {
  // Use the public URL for the image
  return `https://gxrqpnlluwibbmqwkgha.supabase.co/storage/v1/object/public/direction_of_use_images/${path}`;
};

const DrugDetails: React.FC = () => {
  const { id, name } = useLocalSearchParams<{ id: string, name: string }>();

  const { data: directionData, isLoading, error } = useQuery<Product>({
    queryKey: ['instructions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('general_instructions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  if (isLoading) {
    return <ActivityIndicator style={styles.loadingContainer} size="large" color="#000" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTransparent: false, title: 'General Instructions', headerStyle: { backgroundColor: '#0a7ea4' }, headerTintColor: '#fff' }} />
      <View style={styles.drugInfo}>
        <Text style={styles.cardTitle}>{name}</Text>
      </View>
      <FlatList
        data={directionData ? [directionData] : []}
        keyExtractor={(index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image_path ? (
              <View>
                <Text style={styles.cardsubTitle}>Image:</Text>
                <Image
                  source={{ uri: fetchImageUrl(item.image_path) }}
                  style={{ width: 270, height: 200, alignSelf: 'center', marginBottom: 10, resizeMode: 'contain' }}
                />
              </View>
            ) : null}
            {item.instructions ? (
              <View>
                <Text style={styles.cardsubTitle}>Instruction:</Text>
                <Text style={styles.cardText}>{item.instructions}</Text>
              </View>
            ) : null}
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
        marginTop: 38,
      },
    }),
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
    color: '#555',
  },
  cardsubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
});

export default DrugDetails;
