
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppProvider } from "@/components/AppContext";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { AppContext } from "@/components/AppContext";
import Header from "@/components/Header";
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


export default function TabLayout() {
  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext n found</Text>;
  }

  const { shifts, fetchData, caregivers, patients, loading, token, messages } =
    context;

    console.log(shifts, 'app context working');
  return (
 <AppProvider>
    <Tabs >
      <Tabs.Screen
    
        name="home"
        options={{
          title: "Home",
          headerShown:true,
          header: () => <Header/>, // Set custom header for home screen

          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
     
         <Tabs.Screen
        name="shifts"
        options={{
          title: "Shifts",
          headerShown:true,
          header: () => <Header/>, // Set custom header for home screen

          tabBarIcon: ({ color }) => <Ionicons name="timer-outline" size={24} color={color} />,
        }}
      />
         <Tabs.Screen
        name="patients"
        options={{
          title: "Patients",
          headerShown:true,
          header: () => <Header/>, // Set custom header for home screen

          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />,
        }}
      />
       <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown:true,
          header: () => <Header/>, // Set custom header for home screen

          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
    </AppProvider>
  );
}
