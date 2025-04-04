import React from "react";
import { View, Text, StyleSheet, Linking, Image, TouchableOpacity } from "react-native";
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
      <Text style={styles.title}>Emergency Help Needed ?</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            style={{ width: 75, height: 75, borderRadius: 0, margin: 0 }}
            source={require("@/assets/emergencyIcon.png")}
          />
          <View style={styles.cardbody}>

            <Text style={styles.description}>
              This button will connect you with emergency service. Your employer
              will be notified too.
            </Text>

            <TouchableOpacity style={styles.emergencyButton} onPress={handleCallEmergency}>
              <Text style={styles.buttonText}>Emergency Call</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    flexGrow: 1, // Allow ScrollView to grow if the content is larger than the screen

    paddingHorizontal: 10,
  },
  emergencyButton: {

    borderColor: 'red',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 20,
    width: 'auto',
    alignItems: 'center',
    borderRadius: 50,

  },
  buttonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: "center",

  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 2px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  cardbody: {
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 1,
    width: "70%",
  },
  title: {
    fontSize: 16,
    color: "#1E293B",
    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  description: {
    fontSize: 14,
    color: "black",
    fontFamily: "Lato",
    lineHeight: 16,
    fontStyle: "normal",
    textAlign: "center",
    flexWrap: "wrap", // Ensure text wraps inside the container
    maxWidth: "100%", // Prevent text from overflowing
  },
});

export default EmergencyHelpScreen;
