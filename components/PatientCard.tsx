// import { Button } from "@react-navigation/elements";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Button from "@/components/ui/Button";
import { capitalize } from "@/services/utils";

interface PatientCardProps {
  name: string;
  lname: string;
  gender: string;
  conditions: string[];
  image: string;
  onPress: () => void; // Function for handling "View Details"
}

const PatientCard: React.FC<PatientCardProps> = ({
  name,
  lname,
  gender,
  conditions,
  image,
  onPress,
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {/* Left: Circular Avatar Placeholder */}
        <View>
          <Image
            style={styles.profileImage}
            source={{
              uri: image,
            }}
          />
        </View>
        {/* Middle: Patient Info */}
        <View style={styles.info}>
          <Text style={styles.name}>
            {capitalize(name)} {capitalize(lname)}
          </Text>
          <Text style={styles.gender}>({gender})</Text>
          <Text style={styles.conditions}>
            (
            {conditions
              .map((cond) => cond.charAt(0).toUpperCase() + cond.slice(1))
              .join(", ")}
            )
          </Text>
        </View>
        {/* Right: "View Details" Button */}
        {/* <TouchableOpacity onPress={onPress}>
          <Text style={styles.details}>View Details</Text>
        </TouchableOpacity> */}
        <Button handleButtonClick={onPress} buttonText="View Details →" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,

    paddingHorizontal: 5,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 2px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  //boxShadow:
  //"rgba(60, 64, 67, 0.3) 0px 1px 0px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
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
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default PatientCard;
