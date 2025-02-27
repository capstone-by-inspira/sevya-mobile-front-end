import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import AuthGuard from "../../components/AuthGuard";
import { deleteSecureData } from "../../services/secureStorage"; // Secure storage import

export default function Home() {
  const router = useRouter();

  const logout = async () => {
    await deleteSecureData("token");
    await deleteSecureData("user");
    router.replace("/login");
  };

  return (
    <AuthGuard>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome to Sevya</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    </AuthGuard>
  );
}
