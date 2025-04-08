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
  Modal,
  ScrollView,
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


const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("kandanamrata9@gmail.com");
  const [password, setPassword] = useState<string>("namrata");
  const [secureText, setSecureText] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

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

  const openTermsConditions = () => {
    setModalVisible(true);
  }

  const agreeTermsConditions = () => {
    setModalVisible(false);
    setIsChecked(true)
  }

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
      style={styles.background}
    >
      {/* <LinearGradient
    colors={[ '#0D1F3A','#0D1F3A', '#050F1C']} // Adjust colors to match your design

    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    // style={styles.containerMain}
    > */}
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Modal visible={modalVisible} animationType="fade" transparent={true}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={18} color="red" />
                </TouchableOpacity>
                {/* <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Terms and Conditions</Text> */}
                <View style={styles.scrollWrapper}>
                  <ScrollView showsVerticalScrollIndicator={true}>
                    <Text style={styles.heading}>Terms and Conditions</Text>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>1. Introduction</Text>
                      <Text style={styles.text}>
                        Welcome to Sevya. By accessing and using our platform, you agree to comply with the following terms and conditions. If you do not agree with these terms, please do not use the Sevya platform.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>2. Use of the Service</Text>
                      <Text style={styles.text}>
                        Sevya provides AI-powered caregiver management services, which include digitizing patient data, automating translations, and streamlining communication within caregiver agencies. You agree to use Sevya solely for lawful purposes and in accordance with our terms.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>3. User Responsibilities</Text>
                      <Text style={styles.text}>
                        You are responsible for maintaining the confidentiality of your account information, including your password.
                      </Text>
                      <Text style={styles.text}>
                        You agree not to share, transfer, or misuse your account for any fraudulent or unlawful activities.
                      </Text>
                      <Text style={styles.text}>
                        You are responsible for all content uploaded or shared on the platform, including patient data, medical information, and any other sensitive data.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>4. Privacy Policy</Text>
                      <Text style={styles.text}>
                        We take your privacy seriously. By using Sevya, you consent to the collection and use of your personal data as described in our Privacy Policy. We comply with applicable privacy laws to protect your data.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>5. Patient Data</Text>
                      <Text style={styles.text}>
                        Sevya is designed to store patient data securely. You must ensure that all patient information entered into the platform is accurate, up-to-date, and obtained with consent.
                      </Text>
                      <Text style={styles.text}>
                        By using Sevya, you authorize us to process and manage patient data in accordance with the services provided.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>6. Prohibited Activities</Text>
                      <Text style={styles.text}>
                        You are prohibited from:
                      </Text>
                      <Text style={styles.text}>
                        - Uploading or transmitting any content that is unlawful, harmful, or offensive.
                      </Text>
                      <Text style={styles.text}>
                        - Engaging in any activity that could harm or disrupt the platform's operations or services.
                      </Text>
                      <Text style={styles.text}>
                        - Attempting to gain unauthorized access to our systems or any other user’s data.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>7. Intellectual Property</Text>
                      <Text style={styles.text}>
                        All content, trademarks, and logos on Sevya are owned by Sevya or its licensors. You may not use, copy, or distribute any content from Sevya without prior written consent from us.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>8. Disclaimers</Text>
                      <Text style={styles.text}>
                        Sevya is provided "as is" and we do not guarantee the accuracy, reliability, or availability of the platform.
                      </Text>
                      <Text style={styles.text}>
                        We disclaim any liability for damages resulting from the use or inability to use the platform, including but not limited to lost data, profits, or interruptions in service.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>9. Termination of Use</Text>
                      <Text style={styles.text}>
                        We reserve the right to suspend or terminate your account if we suspect you have violated these terms or engaged in harmful activities. Upon termination, you will lose access to your account and any data stored on the platform.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>10. Changes to Terms</Text>
                      <Text style={styles.text}>
                        Sevya may update or modify these Terms and Conditions from time to time. Any changes will be posted on this page, and your continued use of the platform after such changes indicates your acceptance of the new terms.
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>11. Governing Law</Text>
                      <Text style={styles.text}>
                        These Terms and Conditions will be governed by the laws of [Insert Jurisdiction]. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in [Insert Jurisdiction].
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.subHeading}>12. Contact Us</Text>
                      <Text style={styles.text}>
                        If you have any questions or concerns about these Terms and Conditions, please contact us at:
                      </Text>
                      <Text style={styles.text}>
                        Email: sevyaadmin@gmail.com
                      </Text>
                      <Text style={styles.text}>
                        Phone: 111-222-3333
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.agreeButton} onPress={agreeTermsConditions}>
                      <Text style={styles.agreeText}>I Agree</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </View>
          </Modal>

          <Image
            source={require("@/assets/Sevya-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Login with E-mail</Text>
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
          
          {/* <TouchableOpacity style={styles.loginButton} onPress={openTermsConditions}>
            <Text style={{ color: "#fff" }}>Terms and Conditions</Text>
          </TouchableOpacity> */}
          <View style={styles.inputContainer}>
            {isChecked ? <TouchableOpacity style={styles.loginButton } onPress={handleLogin}>
              <Text style={{ color: "#fff" }}>Login</Text>
            </TouchableOpacity> : <TouchableOpacity style={styles.disabledButton } onPress={openTermsConditions}>
              <Text style={{ color: "#fff" }}>Login</Text>
            </TouchableOpacity>}
          </View>
          <Text style={styles.checkboxLabel}>
            By logging in, you agree to our {` `}<Text style={styles.termsLink} onPress={openTermsConditions}>Terms and Conditions</Text>.
          </Text>
        </View>
      </View>
      {/* </LinearGradient> */}
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  containerMain: {
    // flex: 1,
    // opacity:1,

  },
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
    marginTop: 20,
    fontFamily: "Lato",
  },
  disabledButton:{
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
    fontFamily: "Lato",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 24, 50, 0.8)",
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
    fontFamily: "Lato",
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
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
    fontFamily: "Lato",
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  icon: {
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: 'rgba(100, 100, 111, 0.2)',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 29,
    elevation: 3,
    padding: 0,
    zIndex: 1000,
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  scrollWrapper: {
    maxHeight: 600,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  agreeButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    marginTop: 30,
    alignItems: 'center',
    borderRadius: 8,
  },
  agreeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  checkboxLabel: {
    color: "#fff", // white text
    fontSize: 14,   // set the font size
    textAlign: "center", // center the text
    marginTop: 10,  // space above the text
  },
  termsLink: {
    color: "#10B981",  // color for the link
    textDecorationLine: "underline",  // underline the text
  },

});

export default LoginScreen;