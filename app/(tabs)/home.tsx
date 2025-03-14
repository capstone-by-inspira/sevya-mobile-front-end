import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import PatientList from "@/components/PatientList";
import TodaysShift from "@/components/TodaysShift";
import EmergencyHelpScreen from "@/components/EmergencyComponent";
import EmergencyCall from "@/components/EmergencyCall";
import { AppContext } from "@/components/AppContext";

export default function Home() {
  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { shifts, fetchData, caregivers, patients, loading } = context;

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <View style={{ height: 150 }}>
        <Image
          style={{ width: "auto", height: 150, borderRadius: 0, margin: 0 }}
          source={{
            uri: "https://images.unsplash.com/photo-1584515933487-779824d29309",
          }}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      >
        <View
          style={{
            backgroundColor: "#F0F6FF",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flex: 1,
            gap: 50,
          }}
        >
          <View>
            <TodaysShift/>
          </View>

          <View>
            <PatientList patients={patients}></PatientList>
          </View>

          <View>
            <EmergencyHelpScreen />
            <EmergencyCall />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
