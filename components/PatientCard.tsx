import { Button } from "@react-navigation/elements";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

interface PatientCardProps {
  name: string;
  gender: string;
  conditions: string[];
  onPress: () => void; // Function for handling "View Details"
}

const PatientCard: React.FC<PatientCardProps> = ({
  name,
  gender,
  conditions,
  onPress,
}) => {
  return (
    <View style={styles.card}>
      {/* Left: Circular Avatar Placeholder */}
      <View style={styles.avatar}>
        <Text style={styles.cross}>✖</Text>
      </View>

      {/* Middle: Patient Info */}
      <View style={styles.info}>
        <Text style={styles.name}>
          {name} <Text style={styles.gender}>({gender})</Text>
        </Text>
        <Text style={styles.conditions}>({conditions.join(", ")})</Text>
      </View>

      {/* Right: "View Details" Button */}
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.details}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "lightgray",
    marginBottom: 2,
    marginTop: 15,
    boxShadow:
      // "rgba(60, 64, 67, 0.3) 0px 1px 1px 0px, rgba(32, 84, 123, 0.2) 0px 1px 7px 1px",
      "rgba(211, 211, 211, 0.3) 0px 1px 1px 0px, rgba(211, 211, 211, 0.2) 0px 1px 7px 1px",

  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cross: {
    fontSize: 20,
    color: "black",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gender: {
    fontWeight: "normal",
  },
  conditions: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
  },
  details: {
    fontSize: 11,
    fontWeight: "light",
    color: "white",
    borderRadius: 10,
    // textDecorationLine: "underline",
    backgroundColor: "#25578E",
    padding: 10,
  },
});

export default PatientCard;
