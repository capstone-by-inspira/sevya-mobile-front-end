// CustomHeader.tsx
import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppContext } from "@/components/AppContext";
import { useContext, useState, useRef } from "react";
import { Modalize } from "react-native-modalize";
import Notifications from "./Notifications";
import { SafeAreaView } from "react-native";
import { Divider } from "react-native-paper";

const CustomHeader = ({onNotificationPress, onPassNotifications}) => {
  const [newNotifications, setNewNotifications] = useState(0);
  const [notificationAlertComing, setNotificationAlertComing] = useState(false);

  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext n found</Text>;
  }

  const {
    shifts,
    fetchData,
    caregivers,
    patients,
    loading,
    token,
    messages,
    notifications,
    notificationAlert,
  } = context;

  const caregiver = caregivers;

  const router = useRouter();

  const modalizeRef = useRef<Modalize>(null);

   console.log(notifications, "notify>>>>>>");
   useEffect(() => {
    if (notifications && onPassNotifications) {
      onPassNotifications(notifications);
    }
  }, [notifications]);

  useEffect(() => {

    // Trigger the callback whenever the notifications array changes
    if (notificationAlert) {
      setNotificationAlertComing(true);
    }
  }, [notificationAlert]);
  const openModal = () => {
    setNotificationAlertComing(false);
    onNotificationPress();
    // modalizeRef.current?.open();
  };
  const handleNewNotifications = (notifications) => {
    setNewNotifications(notifications.length);
  };

  return (

    <SafeAreaView style={styles.mainContainer}>
      <Modalize
        ref={modalizeRef}
        snapPoint={450}


        modalStyle={styles.modalStyle}
        handleStyle={{
          backgroundColor: "#25578E",
          width: 50,
          height: 6,
          borderRadius: 60,
          alignSelf: "center",
          marginVertical: 10,
        }}
        
        flatListProps={{
          data: notifications,
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




      <View style={styles.headerContainer}>

        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Image
            source={require("@/assets/Sevya-logo.png")}
            style={styles.logo}
          />
        </TouchableOpacity>

        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={openModal}>
            <Ionicons name="notifications-outline" size={27} color="#25578E" />

            {notificationAlertComing && (
              <View
                style={{
                  position: "absolute",
                  right: -3,
                  top: -5,
                  backgroundColor: "red",
                  borderRadius: 50,
                  width: 15,
                  height: 15,
                  borderWidth: 1,
                  borderColor: "white",
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/settings")}>
            <Image
              source={{ uri: caregiver?.image }} // If image is a URL
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Divider/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f4f4f4", // Light grey header background
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  
  },
  mainContainer: {
    backgroundColor: "#F8FBFF",
  },
  modalizeContainer:{

    // width:'100%',
    // height:'100%',
  },
  modalStyle: {
    // position: "absolute",  // Ensures it stays fixed at the bottom
    // width: "100%",
    // height: 50,
    // bottom: 0,
    // zIndex: 999999999999, // Make sure modal is above other content
    // overflow: "hidden", // Prevent overflow

  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F8FBFF",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
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

export default CustomHeader;
