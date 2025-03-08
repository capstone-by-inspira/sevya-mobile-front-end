import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, Linking } from "react-native";
import { Accelerometer } from "expo-sensors";

const EmergencyCall = () => {
  const phoneNumber = "1234567890"; // Replace with actual emergency contact
  const [subscription, setSubscription] = useState<any>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false); // Flag to track alert visibility

  useEffect(() => {
    const subscribe = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      // Adjust the threshold for sensitivity
      if (acceleration > 5.8 && !isAlertVisible) {
        handleShake();
      }
    });

    setSubscription(subscribe);
    return () => subscription && subscription.remove();
  }, [isAlertVisible]); // Dependency on isAlertVisible

  const handleShake = () => {
    if (!isAlertVisible) {
      console.log("Shake detected!");
      setIsAlertVisible(true); // Set the alert visibility flag

      Alert.alert(
        "Emergency Call",
        "Are you sure you want to call this number?",
        [
          { text: "Cancel", style: "cancel", onPress: closeAlert },
          { text: "Call", onPress: makeCall },
        ]
      );
    }
  };

  const closeAlert = () => {
    setIsAlertVisible(false); // Reset the alert visibility flag
  };

  const makeCall = () => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.error("Failed to make call:", err)
    );
    closeAlert(); // Close the alert after making the call
  };

  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        Shake your phone to trigger an emergency call confirmation.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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