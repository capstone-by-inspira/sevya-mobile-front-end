import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface PatientCardProps {
  name: string;
  gender: string;
  condition: string;
  image: any;
  onPress?: () => void;
}

const PatientUCard: React.FC<PatientCardProps> = ({
  name,
  gender,
  condition,
  image,
  onPress,
}) => {
  return (
    <View style={styles.card}>
      <Image
        source={{uri:image}
}
        style={styles.image}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.gender}>{gender}</Text>
      <Text style={styles.condition}>{condition}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>View Details</Text>
        <Icon name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginLeft: 25,
    marginRight: 0,
    alignItems: "center",
    width: 180,
       boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gender: {
    fontSize: 14,
    color: "#555",
  },
  condition: {
    fontStyle: "italic",
    color: "#777",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25578E",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    marginRight: 5,
  },
});

export default PatientUCard;
