import { View, Text } from 'react-native'
import React from 'react'
import Button from "@/components/Button";
import { useAuth } from "@/provider/AuthProvider";
import { supabase } from "@/lib/supabase";

const profile = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
    </View>
  )
}

export default profile;