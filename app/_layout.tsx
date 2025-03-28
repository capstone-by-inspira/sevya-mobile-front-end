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
import { View, Image, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modalize } from 'react-native-modalize';
import { useColorScheme } from "@/hooks/useColorScheme";
import { AppProvider } from "../components/AppContext";
import { Radley_400Regular } from "@expo-google-fonts/radley";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
          <Modalize ref={modalizeRef} snapPoint={250} modalHeight={300}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                Notifications
              </Text>

              {/* Static Notifications */}
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>🔔 Event Reminder</Text>
                <Text>Your event is scheduled for tomorrow at 5 PM.</Text>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>📢 New Update</Text>
                <Text>The app has been updated with new features!</Text>
              </View>

              <View>
                <Text style={{ fontWeight: "bold" }}>🎉 Special Offer</Text>
                <Text>Get 20% off on your next booking!</Text>
              </View>
            </View>
          </Modalize>

          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                title: "",
                headerLeft: () => (
                  <Image
                    source={require("@/assets/Sevya-logo.png")}
                    style={{ width: 40, height: 40, resizeMode: "contain" }}
                  />
                ),
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 15, marginRight: 2 }}>
                    <TouchableOpacity onPress={openModal}>
                      <Ionicons name="notifications-outline" size={24} color="#25578E" />
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => router.replace("/(tabs)/settings")}>
                      <Image
                        source={require('../assets/images/placeholder-image.jpg')}
                        style={{ width: 24, height: 24, borderRadius: 16 }}
                      />
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen name="+not-found" />
            {/* <Stack.Screen name="CarePlan"/> */}
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
