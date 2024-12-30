import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import React from 'react';
import Button from "@/components/Button";
import { useAuth } from "@/provider/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Platform } from 'react-native';
const Profile = () => {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.pic}>
          {user?.full_name.charAt(0)}
        </Text>
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.nameText}>{user?.full_name}</Text>
        </View>
      </View>
      <View style={styles.roleContainer}>  
        <Text style={styles.headerText}>
          {user?.role === 'patient' ? 'Patient' : 'Healthcare Professional'}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => supabase.auth.signOut()}>
              <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
    </View>
  );
};


//can we give different styling to the ios and android
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
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
  pic: {
    width: 70,
    height: 70,
    fontSize: 50,
    borderRadius: 35,
    backgroundColor: 'lightseagreen',
    color: '#fff',
    paddingTop: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#555',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  roleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
});

export default Profile;


