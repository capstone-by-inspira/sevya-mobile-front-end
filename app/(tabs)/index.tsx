import { Image, StyleSheet, Platform , Text, View, Button} from 'react-native';

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  // Google Authentication 
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '62869950842-v4mafvv8tp835tcvo76qbrtfr0kf695u.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri: 'https://auth.expo.io/namratak/sevya-mobile-front-end',
  });

  React.useEffect(() => {
    handleGoogleSignin();
  }, [response]);

  async function handleGoogleSignin() {
    const user = await AsyncStorage.getItem("@user");
    if(!user) {
      if (response?.type === 'success') {
        await getUserInfo(response.authentication?.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token: any) => {
    if(!token) return;
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <>
      <View>
        <Text>{JSON.stringify(userInfo, null, 2)}</Text>
        <Text style= {{color: 'black', fontSize: 20, textAlign: 'center', margin: 10, padding: 10, marginVertical: 100}}>Welcome to the Home Screen</Text>
        <Button title="Sign in with google" onPress={() => promptAsync()} />
        <Button title="Logout" onPress={() => AsyncStorage.removeItem("@user") } />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  
});
