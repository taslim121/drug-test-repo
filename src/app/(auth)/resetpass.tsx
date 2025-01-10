import { View, Text, Alert, TextInput, StyleSheet } from "react-native";
import supabase from "../lib/supabase";
import React, { useState } from "react";
import Button from "../../components/Button";
import { useAuth } from "../../provider/AuthProvider";
import { Stack, useRouter } from "expo-router";

const ResetPass = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {setResetPending} = useAuth();
  // ✅ 1️⃣ Send OTP to email
  async function sendOtp() {
    if (!email) {
      Alert.alert("Error", "Please enter your email to reset password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false }, // Prevents new user creation
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "OTP sent! Check your email.");
      setStep(2); // Move to OTP verification step
    }
    setLoading(false);
  }

  // ✅ 2️⃣ Verify OTP and log in
  async function verifyOtp() {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP received via email.");
      return;
    }
    setLoading(true);
    setResetPending(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery", // This is a password reset OTP
    });

    if (error) {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    } else {
      Alert.alert("Success", "OTP verified! Set a new password.");
      router.replace("/updatepass"); // Navigate to update password screen
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTransparent: false,
          title: "Reset Password",
          headerStyle: { backgroundColor: "#0a7ea4" },
          headerTintColor: "#fff",
        }}
      />
      {step === 1 ? (
        // 📌 Step 1: Enter Email to Send OTP
        <>
          <Text style={styles.label}>Enter your email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="jon@gmail.com"
            style={styles.input}
          />
          <Button text={loading ? "Sending..." : "Send OTP"} onPress={sendOtp} />
        </>
      ) : (
        // 📌 Step 2: Enter OTP for Verification
        <>
          <Text style={styles.label}>Enter OTP sent to {email}</Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
            style={styles.input}
            keyboardType="numeric"
          />
          <Button text={loading ? "Verifying..." : "Verify OTP"} onPress={verifyOtp} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  label: {
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
});

export default ResetPass;
