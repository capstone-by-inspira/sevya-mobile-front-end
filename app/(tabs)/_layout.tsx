
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppProvider } from "@/components/AppContext";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { AppContext } from "@/components/AppContext";
import Header from "@/components/Header";
import { Modalize } from "react-native-modalize";

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
  const modalRef = useRef<Modalize>(null);
  const [headerNotifications, setHeaderNotifications] = useState([]);


  if (!context) {
    return <Text>Error: AppContext n found</Text>;
  }

  const { shifts, fetchData, caregivers, patients, loading, token, messages , notifications} =
    context;

    console.log(notifications, 'app context working');
    const openModal = () => {
      modalRef.current?.open();
    };
  
  return (
 <AppProvider>
    <Tabs >
      <Tabs.Screen
    
        name="home"
        options={{
          title: "Home",
          headerShown:true,
          header: () => <Header onNotificationPress={openModal}   onPassNotifications={(notifs) => setHeaderNotifications(notifs)}/>, // Set custom header for home screen

          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
     
         <Tabs.Screen
        name="shifts"
        options={{
          title: "Shifts",
          headerShown:true,
          header: () => <Header onNotificationPress={openModal} onPassNotifications={(notifs) => setHeaderNotifications(notifs)}/>, // Set custom header for home screen

          tabBarIcon: ({ color }) => <Ionicons name="timer-outline" size={24} color={color} />,
        }}
      />
         <Tabs.Screen
        name="patients"
        options={{
          title: "Patients",
          headerShown:true,
          header: () => <Header onNotificationPress={openModal} onPassNotifications={(notifs) => setHeaderNotifications(notifs)}/>, // Set custom header for home screen

          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />,
        }}
      />
       <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown:true,
          header: () => <Header onNotificationPress={openModal} onPassNotifications={(notifs) => setHeaderNotifications(notifs)}/>, // Set custom header for home screen

          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      />
    </Tabs>


    <Modalize
        ref={modalRef}
        snapPoint={450}


        handleStyle={{
          backgroundColor: "#25578E",
          width: 50,
          height: 6,
          borderRadius: 60,
          alignSelf: "center",
          marginVertical: 10,
        }}
        
        flatListProps={{
          data: headerNotifications,
          keyExtractor: (item) => item.id,
          renderItem: ({ item }) => (
            <View style={styles.notificationItem}>
              <Image source={require("@/assets/Sevya-logo.png")} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: "#000" }]}>
                  {item.title}
                </Text>
                <Text style={[styles.message, { color: "#555" }]}>
                  {item.message}
                </Text>
              </View>
            </View>
          ),
          showsVerticalScrollIndicator: false,
        }}
      >
        </Modalize>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
 
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
