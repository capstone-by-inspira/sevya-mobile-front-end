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
import WebSocketClient from "@/components/WebSocketClient";
import * as Notifications from 'expo-notifications';
import Button from '@/components/ui/Button'
// import SevyaToast from '@/components/SevyaToast'

export default function Home() {
 


  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext n found</Text>;
  }

  const { shifts, fetchData, caregivers, patients, loading, token, messages } = context;

  // console.log(context, 'web scoket >>>>>>>');

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(); // Reload data
    setRefreshing(false);
  }, [fetchData]);

 
 // console.log(patients, 'ncjnajncskcn');

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <>
              {/* <SevyaToast message={messages}/> */}

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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
            <TodaysShift shifts  = {shifts} caregiver={caregivers} patients = {patients}/>
          </View>

          <View>
            <PatientList patients={patients}></PatientList>
          </View>

          <View>
            <EmergencyHelpScreen />
            <EmergencyCall caregiver={caregivers} token={token}/>
          </View>

          
        </View>

      </ScrollView>
    </>
  );
}
