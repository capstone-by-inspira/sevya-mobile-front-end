import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
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
import { Divider } from "react-native-paper";
import Placeholder from "@/components/Placeholder";
import SkeletonComponent from "@/components/SkeletonComponent";
import DashboardCard from "@/components/DashboardCard";

// import SevyaToast from '@/components/SevyaToast'

export default function Home() {
  const context = useContext(AppContext);


  if (!context) {
    return <Text>Error: AppContext n found</Text>;
  }

  const { shifts, fetchData, caregivers, patients, loading, token, messages, notifications } =
    context;

  // console.log(context, 'web scoket >>>>>>>');

  const [refreshing, setRefreshing] = useState(false);
  const [loadedContent, setLoadedContent] = useState(true);

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

  useEffect(() => {
    console.log(shifts.length);
    if (
      Array.isArray(patients) && patients.length &&
      caregivers && Object.keys(caregivers).length &&
      Array.isArray(shifts) && shifts.length
    ) {      console.log("use effect >>>>>>>>>");
      setLoadedContent(true);
    }else{
      setLoadedContent(false);
    }
  }, [patients, caregivers, shifts]);



  return (
    <>
      {/* <SevyaToast message={messages}/> */}



      <ScrollView
        style={{ backgroundColor: "#F8FBFF" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
             <View style={{ height: 150, backgroundColor: "#F8FBFF" }}>
        <Image
          style={{ width: "auto", height: 150, borderRadius: 0, margin: 0 }}
          source={require("@/assets/heroImage.jpeg")}
        />
      </View>
        {!loadedContent ? (
          <Placeholder />
        ) : (
          <View
            style={{
              backgroundColor: "#F8FBFF",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              flex: 1,
              gap: 30,
            }}
          >
           
            <View>
              <TodaysShift
                shifts={shifts}
                caregiver={caregivers}
                patients={patients}
                token={token}
              />
            </View>

            <Divider />

            <View style={styles.patientList}>
              <PatientList
                patients={patients}
                shifts={shifts}
                caregivers={caregivers}
              ></PatientList>
            </View>
            <EmergencyCall caregiver={caregivers} token={token}  patients ={patients}/>
          </View>
        )}
        <Divider />
        <View style={styles.emergency}>
          <EmergencyHelpScreen />
        </View>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  patientList: {
    marginRight: 20,
    paddingRight: 0,
  },
  emergency: {
    marginTop: 20,
    padding: 10,
  },

  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    marginTop: 3,
  },

});
