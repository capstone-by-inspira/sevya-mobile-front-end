import { View, Text, Image, Alert, StyleSheet } from "react-native";
import {AuthGuard} from "../../components/AuthGuard";
import Button from "@/components/ui/Button";
import TodaysShift from "@/components/TodaysShift";
import { getDocumentById, getDocumentByKeyValue , getDocuments} from "@/services/api";

import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { deleteSecureData, getSecureData } from "../../services/secureStorage";
import { DashNameBar } from "@/components/DashNameBar";
import EmergencyHelpScreen from "@/components/EmergencyComponent";

export default function Home() {
  const router = useRouter();
  // const [userData, setUserData] = useState<any>(null); // State to store user data
  // const [token, setToken] = useState<string | null>(null);
  
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = await getSecureData("token");
  //     if(token){
  //       setToken(token);
  //     }
  //     const userString = await getSecureData("user");
  //     if (userString) {
  //       const user = JSON.parse(userString); // Parse the JSON string
  //       console.log('user>>>>>', user);
  //       setUserData(user);
  //     }
  //   };

  //   fetchUser();
  // }, []);


  


  


  const logout = async () => {
    await deleteSecureData("token");
    await deleteSecureData("user");
    router.replace("/login");
  };

  // const refreshData = () => {
  //   fetchPatients();
  //   fetchCaregiver();
  //   fetchShifts();
  // };

  return (
    <AuthGuard>
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
       <EmergencyHelpScreen/>
        <Button handleButtonClick={logout} buttonText="Logout" />
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
