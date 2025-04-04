// import { Button } from "@react-navigation/elements";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Button from '@/components/ui/Button'
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
          {name} {lname}
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
  );
};

const styles = StyleSheet.create({
  card: {
    width:"100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    paddingLeft:14,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 14,

    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginBottom: 10,
    marginTop: 10,
  },
   //boxShadow:
    //"rgba(60, 64, 67, 0.3) 0px 1px 0px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    shadowBox: {
      backgroundColor: 'white',
      padding: 14,
      borderRadius: 8, 
      shadowColor: 'rgba(0, 0, 0, 0.14)', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.14, 
      shadowRadius: 4, 
      elevation: 10, 
    },
  profileImage: {
   width:70,
   height:70,
   borderRadius:50,
   marginRight:10
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
