import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
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
import PatientUCard from "@/components/PatientUCard";

export default function Home() {
  const router = useRouter();

  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { isAuth, caregivers, patients, shifts, fetchData } = context;

  console.log("caregiver??", caregivers);

  const renderPatientCard = ({ item }) => (
    <PatientUCard
      name={item.firstName} // Adjust based on your patient data structure
      gender={item.gender} // Adjust based on your patient data structure
      condition={item.medicalConditions?.join(", ") || "N/A"} // Adjust based on your patient data structure
      image={item.image} // Adjust based on your patient data structure
      onPress={() => {
        // Navigate to patient details or perform any action
        router.push(`/patients/${item.id}`);
        // console.log(`Viewing details for ${item.firstName}`);
      }}
    />
  );

  
  return (
    <AppProvider>
       <View style={{ height: 150 }}>
            <Image
              style={{ width: "auto", height: 150, borderRadius: 0, margin: 0 }}
              source={{
                uri: "https://images.unsplash.com/photo-1584515933487-779824d29309",
              }}
            />
          </View>
      <ScrollView>
        <View
          style={{
            backgroundColor: "#F0F6FF",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flex: 1,
            gap:50,
         
          }}
        >
         
          <View >
            <TodaysShift />
          </View>

          <View >
            <FlatList
              data={patients}
              renderItem={renderPatientCard}
              keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View>
            <EmergencyHelpScreen />
          </View>
        </View>
      </ScrollView>
    </AppProvider>
  );
}
