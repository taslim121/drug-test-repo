import { ActivityIndicator, Text, View } from "react-native";
import { Redirect, Link } from "expo-router";
import Button from "@/components/Button";
import { useAuth } from "@/provider/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function Index() {
  const { session, loading,isAdmin,isHcp,isPatient,user} = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }
  if (!session) {
    return <Redirect href={'/main'} />;
  }
  if(isPatient && !isAdmin && !isHcp){
    return <Redirect href={'/drugs-list'} />;
  }
  if(isHcp && !isAdmin && !isPatient){
    return <Redirect href={'/(hcp)/hcp_home'} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link href={'/drugs-list'} asChild>
        <Button text="Patient" />
      </Link>
      <Link href={'/(hcp)/hcp_home'} asChild>
        <Button text="Hcp" />
      </Link>
      <Link href={'/crud-admin'} asChild>
        <Button text="Admin" />
      </Link>
      <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
    </View>
  );
}