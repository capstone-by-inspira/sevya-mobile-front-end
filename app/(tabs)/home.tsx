import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AuthGuard from "../../components/AuthGuard";
import { deleteSecureData, getSecureData } from "../../services/secureStorage";
import { DashNameBar } from "@/components/DashNameBar";
import { Alert } from "react-native/Libraries/Alert/Alert";

export default function Home() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null); // State to store user data

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await getSecureData("user");
      if (userString) {
        const user = JSON.parse(userString); // Parse the JSON string
        setUserData(user);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await deleteSecureData("token");
    await deleteSecureData("user");
    router.replace("/login");
  };

  return (
    <AuthGuard>
      <DashNameBar userName={userData ? userData.name : "Guest"} />
      <View>
        <View style={btnStyle.container}>
          <Button
            title="Ready for your shift?"
            color={"white"}
            onPress={() => console.log("Button Pressed!")}
          />
        </View>
      </View>
    </AuthGuard>
  );
}
const btnStyle = StyleSheet.create({
  container: {
    backgroundColor: "black",
    width: "50%",
    alignSelf: "center",
    borderRadius: 14,
    marginTop: 10,
  },
});
