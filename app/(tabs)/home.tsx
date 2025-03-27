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
import * as Notifications from "expo-notifications";
import Button from "@/components/ui/Button";
import { createDocument } from "@/services/api";
import { sendNotification } from "@/services/utils";
// import SevyaToast from '@/components/SevyaToast'

export default function Home() {
  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext n found</Text>;
  }

  const { shifts, fetchData, caregivers, patients, loading, token, messages } =
    context;

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

  // const handleNotification = async () =>{
  //   console.log('handle notification >>>>>>>>>');
  //   const data = {
  //     title: 'New Message',
  //     body: 'You have a new message',
  //     createdBy:caregivers.firstName
  //   }

  //  await sendNotification('done', 'work completed', caregivers.firstName, token);


  // }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F8FBFF', }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {/* <SevyaToast message={messages}/> */}

      <View style={{ height: 150, backgroundColor: '#F8FBFF', }}>
        <Image
          style={{ width: "auto", height: 150, borderRadius: 0, margin: 0 }}
          source={{
            uri: "https://images.unsplash.com/photo-1584515933487-779824d29309",
          }}
        />
      </View>
      <ScrollView style={{backgroundColor: '#F8FBFF'}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            backgroundColor: '#F8FBFF',
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flex: 1,
            gap: 50,
          }}
        >
            {/* <Button
              handleButtonClick={handleNotification}
              buttonText="Send Notification"
              disabled={false}
            /> */}
          <View>
            <TodaysShift
              shifts={shifts}
              caregiver={caregivers}
              patients={patients}
              token={token}
            />
          </View>

          <View>
            <PatientList patients={patients} shifts={shifts} caregivers={caregivers}></PatientList>
          </View>

          <View>
            <EmergencyHelpScreen />
            <EmergencyCall caregiver={caregivers} token={token} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
