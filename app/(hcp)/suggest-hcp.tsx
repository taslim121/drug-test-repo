import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/provider/AuthProvider';

const Suggest = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('Drug Missing');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Drug Missing', value: 'Drug Missing' },
    { label: 'Required More Info', value: 'Required More Info' },
    { label: 'Other', value: 'Other' },
  ]);

  const handleSubmit = async () => {
    if (description === '') {
      Alert.alert('Error', 'Please fill the description');
      return;
    }

    const { error } = await supabase
      .from('suggestions')
      .insert([{ name: user?.full_name, role: user?.role, query, description }]);

    if (error) {
      console.error(error);
      Alert.alert('Error', 'There was an error submitting your suggestion');
    } else {
      Alert.alert('Success', 'Your suggestion has been submitted');
      setQuery('Drug Missing');
      setDescription('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Submit a Suggestion</Text>
      <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Query</Text>
      <DropDownPicker
        open={open}
        value={query}
        items={items}
        setOpen={setOpen}
        setValue={setQuery}
        setItems={setItems}
        containerStyle={styles.dropdown}
        style={styles.dropdownInner}
        textStyle={styles.dropdownText}
      />
      <Text style={{ margin: 10, fontWeight: 'bold' }}>Description up to 50 words</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        maxLength={250}  // Assuming 50 words is roughly 250 characters
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f2ed',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdown: {
    marginBottom: 10,
    height: 40,
  },
  dropdownInner: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'lightseagreen',
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Suggest;
