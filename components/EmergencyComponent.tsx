import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
} from "react-native";
import Button from "@/components/ui/Button";

const EmergencyHelpScreen: React.FC = () => {
  const phoneNumber = "911";

  const handleCallEmergency = () => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.error("Failed to make call:", err)
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Emergency Help Needed</Text>
        <Text style={styles.description}>
          This button will connect you with emergency service. Your employer
          will be notified too.
        </Text>
        <Button
          handleButtonClick={handleCallEmergency}
          buttonText="Emergency Call"
          disabled={false}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    
  },
  card: {
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  title: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 14,
  },
});

export default EmergencyHelpScreen;
