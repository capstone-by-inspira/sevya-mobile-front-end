import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { auth } from "@/services/firebase";

const API_URL = "http://localhost:8800/api";
const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const userCredential = await auth.signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const idToken = await userCredential.user.getIdToken();
            console.log(idToken);
            await authenticate(idToken);
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const authenticate = async (idToken: any) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/admin/firebase`, { idToken, collectionName: 'admin' });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigation.navigate('Home');
            console.log("Login Successful:", data);
        } catch (error : any) {
            console.error(
                "Authentication Error:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <View style={styles.container}>
              <Text style={styles.title}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button title="Login" onPress={handleLogin} />
            </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
    },
  });