import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import "react-native-reanimated";
import { View, Image, TouchableOpacity, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modalize } from 'react-native-modalize';
import { useColorScheme } from "@/hooks/useColorScheme";
import { AppProvider } from "../components/AppContext";
import { Radley_400Regular } from "@expo-google-fonts/radley";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Notifications from "@/components/Notifications";
import Welcome from "./screens/Welcome";
import 'react-native-gesture-handler';
import 'react-native-reanimated';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const modalizeRef = useRef<Modalize>(null);
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

  const openModal = () => {
    console.log('opening', modalizeRef.current?.open)
    modalizeRef.current?.open();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ThemeProvider value={colorScheme === "light" ? DefaultTheme : DefaultTheme}>
          <Modalize ref={modalizeRef} snapPoint={700} modalHeight={700}>
            <Notifications />
          </Modalize>

          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                title: "",
                headerLeft: () => (
                  <Pressable onPress={() => router.replace("/(tabs)/home")}>
                    <Image
                      source={require("@/assets/Sevya-logo.png")}
                      style={{ width: 40, height: 40, resizeMode: "contain" }}
                    />
                  </Pressable>
                ),
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 15, marginRight: 2 }}>
                    <TouchableOpacity onPress={openModal}>
                      <Ionicons name="notifications-outline" size={24} color="#25578E" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.replace("/(tabs)/settings")}>
                      <Image
                        source={require('../assets/images/placeholder-image.jpg')}
                        style={{ width: 40, height: 40, borderRadius: '50%' }}
                      />
                    </TouchableOpacity>
                  </View>
                ),
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
