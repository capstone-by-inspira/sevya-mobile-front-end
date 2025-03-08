import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { AppProvider, AuthGuard } from "../../components/AuthGuard";
import Button from "@/components/ui/Button";
import TodaysShift from "@/components/TodaysShift";
import {
  getDocumentById,
  getDocumentByKeyValue,
  getDocuments,
} from "@/services/api";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "expo-router";
import { deleteSecureData, getSecureData } from "../../services/secureStorage";
import { DashNameBar } from "@/components/DashNameBar";
import EmergencyHelpScreen from "@/components/EmergencyComponent";
import { AppContext } from "@/components/AuthGuard";
import EmergencyCall from "@/components/EmergencyCall";

export default function Home() {
  const router = useRouter();

  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { isAuth, caregivers, patients, shifts, fetchData } = context;

  console.log("caregiver??", caregivers);

  return (
    <AppProvider>
      <View
        style={{
          backgroundColor: "#F0F6FF",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          flex: 1,
        }}
      >
        <View style={{ height: 150 }}>
          <Image
            style={{ width: "auto", height: 150, borderRadius: 0, margin: 0 }}
            source={{
              uri: "https://images.unsplash.com/photo-1584515933487-779824d29309",
            }}
          />
        </View>
        <TodaysShift />
        <EmergencyHelpScreen />
      </View>
    </AppProvider>
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
