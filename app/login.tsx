import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import Button from "@/components/ui/Button";
import { useNavigation, useRouter } from "expo-router";
import axios from "axios";
import { auth } from "@/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { saveSecureData, getSecureData } from "@/services/secureStorage";
import { API_URL } from "@/services/api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 


const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("nammy@caregiver.com");
  const [password, setPassword] = useState<string>("nammy123");
  const [secureText, setSecureText] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);



  useEffect(() => {
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
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/Sevya-logo.png")} 
            style={styles.logo} 
            resizeMode="contain" 
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Sign in with E-mail</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              placeholder="Enter your e-mail"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                style={styles.passwordInput} // Applied correct styling
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.icon}>
                <Icon name={secureText ? "eye-off" : "eye"} size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={{color: "#fff"}}>Login</Text> 
            </TouchableOpacity>
          </View>
          
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
  loginButton: {
    backgroundColor: "#10B981", 
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 40,
    fontFamily: "Lato",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 24, 50, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 70,
  },
  logo: {
    width: 75,
    height: 75,
  },
  container: {
    width: "60%",
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: "center",
    marginBottom: 80
  },
  title: {    
    color: "white",
    marginBottom: 20,
    fontFamily: "Lato",
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 26,
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 25,
    marginBottom: 15,
    textAlign: "left",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  inputLabel: {
    color: "#FFF", 
    fontFamily: "Lato",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 14,
    paddingBottom: 8,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1, 
    paddingVertical: 15,
    textAlign: "left",
    fontSize: 14,
  },
  icon: {
    padding: 10,
  },
});

export default LoginScreen;