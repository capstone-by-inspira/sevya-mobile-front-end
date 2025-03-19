// import { Button } from "@react-navigation/elements";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Button from '@/components/ui/Button'
interface PatientCardProps {
  name: string;
  gender: string;
  conditions: string[];
  image: string;
  onPress: () => void; // Function for handling "View Details"
}

const PatientCard: React.FC<PatientCardProps> = ({
  name,
  gender,
  conditions,
  image,
  onPress,
}) => {
  return (
    <View style={styles.card}>
      {/* Left: Circular Avatar Placeholder */}
      <View >
        <Image
          style={{ width: "50", height: "50", borderRadius: 50, marginRight: 10 }}
          source={{
            uri:image,
          }}
        />
      </View>

      {/* Middle: Patient Info */}
      <View style={styles.info}>
        <Text style={styles.name}>
          {name} <Text style={styles.gender}>({gender})</Text>
        </Text>
        <Text style={styles.conditions}>({conditions.join(", ")})</Text>
      </View>

      {/* Right: "View Details" Button */}
      {/* <TouchableOpacity onPress={onPress}>
        <Text style={styles.details}>View Details</Text>
      </TouchableOpacity> */}
      <Button handleButtonClick={onPress} buttonText="View Details" />

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 2,
    marginTop: 15,
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  avatar: {
   
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
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default PatientCard;
