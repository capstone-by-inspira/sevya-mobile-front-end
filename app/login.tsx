import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import Button from "@/components/ui/Button";

import { useRouter } from "expo-router";
import axios from "axios";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { saveSecureData, getSecureData } from "../services/secureStorage"; // Import Seure Storage utility

const API_URL = "http://192.168.1.212:8800/api";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("nammy@caregiver.com");
  const [password, setPassword] = useState<string>("nammy123");
  const router = useRouter();

  const handleLogin = async () => {

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();
      // console.log("Firebase Token:", idToken);
      await authenticate(idToken);
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Invalid email or password");
    }
  };

  const authenticate = async (idToken: string) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/caregiver/firebase`, {
        idToken,
        collectionName: "caregivers",
      });

      // console.log("Full data received from API:", data);

      // Securely store token and user data
      await saveSecureData("token", data.token);
      await saveSecureData("user", JSON.stringify(data.user));

      const first_time_login = await getSecureData("first_time_login");
      if (!first_time_login) {
        router.replace("/screens/InfoScreen");
      } else {
        router.replace("/(tabs)/home");
      }

      Alert.alert("Success", "Login Successful");
      console.log("Login Successful:", data);
    } catch (error: any) {
      console.error("Authentication Error:", error);
      Alert.alert("Error", "Failed to authenticate user.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
  
      <Button
          handleButtonClick={handleLogin}
          buttonText="Login"
          disabled={false}
        />
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  form:{
padding:40,
    width: '100%',
    marginBottom: 20,


  },
  input: {

    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: 10,
  },
  button: { backgroundColor: "blue", padding: 10, borderRadius: 5 },
  buttonText: { color: "white" },
});

export default LoginScreen;
