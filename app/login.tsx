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
import { LinearGradient } from 'expo-linear-gradient'; // Add this import
import { globalStyles } from "@/styles/globalStyles";


const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("nammy@caregiver.com");
  const [password, setPassword] = useState<string>("nammy123");
  const [secureText, setSecureText] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();




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
      // router.push("/(tabs)/home");
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


      console.log(first_time_login, '>>>>>> fsttttttt');



      if (first_time_login == null || first_time_login == undefined) {
        router.replace("/screens/Welcome");
      } else {
        console.log('go to home screen');
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
      style={globalStyles.loginBackground}
    >
      {/* <LinearGradient
    colors={[ '#0D1F3A','#0D1F3A', '#050F1C']} // Adjust colors to match your design

    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    // style={styles.containerMain}
    > */}
      <View style={globalStyles.loginOverlay}>
        <View style={globalStyles.loginLogoContainer}>
          <Image
            source={require("@/assets/Sevya-logo.png")}
            style={globalStyles.loginLogo}
            resizeMode="contain"
          />
        </View>
        <View style={globalStyles.loginContainer}>
          <Text style={globalStyles.loginTitle}>Sign in with E-mail</Text>
          <View style={globalStyles.loginInputContainer}>
            <Text style={globalStyles.loginInputLabel}>E-mail</Text>
            <TextInput
              placeholder="Enter your e-mail"
              value={email}
              onChangeText={setEmail}
              style={globalStyles.loginInput}
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={globalStyles.loginInputContainer}>
            <Text style={globalStyles.loginInputLabel}>Password</Text>
            <View style={globalStyles.loginPasswordWrapper}>
              <TextInput
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                style={globalStyles.loginPasswordInput} // Applied correct styling
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)} style={globalStyles.loginIcon}>
                <Icon name={secureText ? "eye-off" : "eye"} size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={globalStyles.loginInputContainer}>
            <TouchableOpacity style={globalStyles.loginButton} onPress={handleLogin}>
              <Text style={{ color: "#fff" }}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      {/* </LinearGradient> */}
    </ImageBackground>

  );
};

export default LoginScreen;