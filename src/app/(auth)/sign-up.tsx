import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import { Link, Stack,useRouter } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import supabase from '../../lib/supabase';
import Button from '../../components/Button';
import Colors from '../../constant/Colors';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Patient', value: 'patient' },
    { label: 'Health Care Professional', value: 'hcp' },
  ]);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Please verify your email to complete the sign-up process.',);
    }

   
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{headerTransparent:true , title: 'Sign up', headerStyle:{ backgroundColor: '#0a7ea4'}, headerTintColor: '#fff' }} />
      
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="John Doe"
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.label}>Role</Text>
      <DropDownPicker
        open={open}
        value={role}
        items={items}
        setOpen={setOpen}
        setValue={setRole}
        setItems={setItems}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        textStyle={styles.dropdownText}
      />

      <Button text={loading ? 'Creating account...' : 'Create account'} onPress={signUpWithEmail} disabled={loading} />
      <TouchableOpacity onPress={()=> router.replace('/sign-in')} style={styles.textButton}>
              <Text style={{color:'#0a7ea4'}}>Sign In</Text>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#f3f2ed',
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 1000, // Ensures the dropdown is above other elements
  },
  dropdown: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 5,
  },
  dropdownInner: {
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default SignUpScreen;
