import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { deleteSecureData, getSecureData } from "../../services/secureStorage";
import { useRouter } from "expo-router";

import Button from "@/components/ui/Button";
import ProfileScreen from "@/components/ProfileComponent";
import * as Notifications from "expo-notifications";
const settings = () => {
  const router = useRouter();

  const logout = async () => {
    await deleteSecureData("token");
    await deleteSecureData("user");
    await deleteSecureData("first_time_login");
    router.replace("/login");
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ProfileScreen />
        <Button handleButtonClick={logout} buttonText="Logout" />
      </View>
      <View>
        <Text>Notification Settings</Text>
      </View>
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F0F6FF",
    height: "100%",
  },
});

export default settings;
