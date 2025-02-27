import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { getSecureData } from "../services/secureStorage"; // Import secure storage

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getSecureData("token"); // Get token securely
      setIsAuth(!!token);
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

  return isAuth ? <>{children}</> : <Redirect href="/login" />;
};

export default AuthGuard;
