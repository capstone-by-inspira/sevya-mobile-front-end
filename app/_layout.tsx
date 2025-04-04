import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";
import { View, Image, TouchableOpacity, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AppProvider } from "../components/AppContext";
import { Radley_400Regular } from "@expo-google-fonts/radley";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Notifications from "@/components/Notifications";
import Welcome from "./screens/Welcome";
import "react-native-gesture-handler";
import "react-native-reanimated";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

interface Caregiver {
  [key: string]: any;
}
export default function RootLayout() {

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Radley: Radley_400Regular,
    LatoRegular: Lato_400Regular,
    LatoBold: Lato_700Bold,
  });


  


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }






  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ThemeProvider
          value={colorScheme === "light" ? DefaultTheme : DefaultTheme}
        >
       
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="Welcome" options={{ headerShown: false }} />

            {/* <Stack.Screen name="CarePlan"/> */}
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
