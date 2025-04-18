
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { getSecureData } from "../services/secureStorage";
import EmergencyCall from "@/components/EmergencyCall";
import 'react-native-gesture-handler';
import 'react-native-reanimated';


SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('to');
      try {
        const token = await getSecureData("token");
        console.log(token, 'token >>>>>>>>>>>>>');
        if (token) {
          setIsAuth(!!token);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(null);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuth ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />;
}