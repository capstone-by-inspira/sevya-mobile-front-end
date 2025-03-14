// import { useEffect, useState, useContext } from "react";
// import { View, ActivityIndicator } from "react-native";
// import { Redirect } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { getSecureData } from "../services/secureStorage"; // Import utility
// import EmergencyCall from "@/components/EmergencyCall";
// import { AppProvider, AuthGuard } from "@/components/AuthGuard";

// SplashScreen.preventAutoHideAsync();

// export default function Index() {
//   const [isAuth, setIsAuth] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await getSecureData("token");
//         if (token) {
//           console.log("token??");
//           setIsAuth(!!token);
//         } else {
//           setIsAuth(false);
//         }
//       } catch (error) {
//         setIsAuth(null);
//       } finally {
//         await SplashScreen.hideAsync();
//       }
//       SplashScreen.hideAsync(); // Hide splash screen after authentication check
//     };

//     checkAuth();
//   }, []);

//   if (isAuth === null) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//         <EmergencyCall />
//       </View>
//     );
//   }

//   return isAuth ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />;
// }


// index.tsx
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { getSecureData } from "../services/secureStorage";
import EmergencyCall from "@/components/EmergencyCall";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getSecureData("token");
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