import React, { useEffect, useRef, useState } from "react";
import { View, Text, Alert, StyleSheet, Linking } from "react-native";
import { Accelerometer } from "expo-sensors";
import { getDocumentById, getDocuments, updateDocument , createDocument} from "@/services/api";
import { Divider } from "react-native-paper";

const EmergencyCall = ({caregiver, token, patients}) => {
  const[caregiverData, setCaregiverData] = useState(null);
  console.log(caregiver.uid, 'caregiver');
  const phoneNumber = "911"; // Replace with actual emergency contact
  const isAlertVisibleRef = useRef(false); // Use a ref to track alert visibility
  const lastShakeTimeRef = useRef(0); // Use a ref to track the last shake time

  useEffect(() => {
    const subscribe = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      // Adjust the threshold for sensitivity
      if (acceleration > 3.8 && !isAlertVisibleRef.current) {
        const currentTime = new Date().getTime();

        // Debounce: Only trigger if 2 seconds have passed since the last shake
        if (currentTime - lastShakeTimeRef.current > 2000) {
          lastShakeTimeRef.current = currentTime;
          handleShake(caregiver.uid);
        }
      }
    });

    return () => subscribe.remove(); // Cleanup on unmount
  }, [caregiver]);

  useEffect(() => {

if(caregiver){
  setCaregiverData(caregiver.uid);
}

  }, [caregiver])


  const handleShake = (caregiverId) => {
  
    if (!isAlertVisibleRef.current) {
      isAlertVisibleRef.current = true; // Set the alert visibility flag

      Alert.alert(
        "Emergency Call",
        "Are you sure you want to call this number?",
        [
          { text: "Cancel", style: "cancel", onPress: closeAlert },
          { text: "Call", onPress: () => {
            handleCallEmergency();
            createEmergencyDocument(caregiverId);
          }, },
        ],
        { onDismiss: closeAlert } // Ensure the alert is dismissed properly
      );
    }
  };

  const closeAlert = () => {
    isAlertVisibleRef.current = false; // Reset the alert visibility flag
  };

  const handleCallEmergency = () => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.error("Failed to make call:", err)
    );
    closeAlert(); // Close the alert after making the call
  };

 const createEmergencyDocument = async (caregiverId) => {


  const data = {
    name: "Emergency Call",
    timestamp:new Date(),
    caregiverId:caregiverId,
  }
    try {
      const response = await createDocument('emergency', data, token);
      // console.log(response, 'emergency done');
      console.log("Emergency document created successfully");
    } catch (error) {
      console.error("Error creating emergency document:", error);
    }
  };
  return <>


  </>;
};

const styles = StyleSheet.create({
  emergencyDoc:{
    paddingHorizontal:20,

  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  info: {
    fontSize: 18,
    textAlign: "center",
    padding: 20,
  },
});

export default EmergencyCall;