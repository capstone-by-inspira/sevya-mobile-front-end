import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import axios from "axios";
import { auth } from "@/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { saveSecureData, getSecureData } from "@/services/secureStorage";
import { API_URL } from "@/services/api";
import { useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("nammy@caregiver.com");
  const [password, setPassword] = useState<string>("nammy123");
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for password visibility
  const router = useRouter();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();
      await authenticate(idToken);
      router.push("/(tabs)/home");
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

      await saveSecureData("token", data.token);
      await saveSecureData("user", JSON.stringify(data.user));

      const first_time_login = await getSecureData("first_time_login");
      if (!first_time_login) {
        router.replace("/screens/InfoScreen");
      } else {
        router.replace("/(tabs)/home");
      }

      Alert.alert("Success", "Login Successful");
    } catch (error: any) {
      console.error("Authentication Error:", error);
      Alert.alert("Error", "Failed to authenticate user.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/main-bg.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Sign in with E-mail</Text>
          <TextInput
            placeholder="Enter your e-mail"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#ccc"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword} // Toggle visibility
              style={styles.input}
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon
                name={showPassword ? "eye" : "eye-slash"} // Toggle icon based on state
                size={20}
                color="#000"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <Button
            handleButtonClick={handleLogin}
            buttonText="Login"
            disabled={false}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 24, 50, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 25,
    marginBottom: 15,
    textAlign: "left",
  },
  passwordContainer: {
    position:"relative",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyeIcon: {
    position:'absolute',
    right:5,
    top:6,
  },
});

export default LoginScreen;