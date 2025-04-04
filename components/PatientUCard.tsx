import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface PatientCardProps {
  name: string;
  lname: string;
  gender: string;
  condition: string;
  image: any;
  onPress?: () => void;
}

const PatientUCard: React.FC<PatientCardProps> = ({
  name,
  lname,
  gender,
  condition,
  image,
  onPress,
}) => {
  const [showFullName, setShowFullName] = useState(false);

  const fullName = `${name} ${lname}`;
  const truncatedName = fullName.length > 15 ? `${fullName.slice(0, 12)}...` : fullName;

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      {/* Name Section - Expand on Click */}
      <TouchableOpacity onPress={() => setShowFullName(!showFullName)}>
        <Text style={styles.name}>
          {showFullName ? fullName : truncatedName}
        </Text>
      </TouchableOpacity>

      <Text style={styles.gender}>{gender}</Text>

      {/* Fixed Height Condition Section */}
      <View style={styles.conditionContainer}>
        <Text style={styles.condition} numberOfLines={2} ellipsizeMode="tail">
          {condition}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>View Details</Text>
        <Icon name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    fontFamily: "Lato",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginLeft: 25,
    marginTop: 10,
    marginRight: 2,
    marginBottom: 20,
    alignItems: "center",
    width: 180,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 2px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    textAlign: "center",
    color: "#333",
    fontSize: 16,
    fontFamily: "Lato",
    fontWeight: "700",
    lineHeight: 16,
  },
  gender: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Lato",
    lineHeight: 16,
  },
  conditionContainer: {
    minHeight: 40, // Ensures condition stays same height
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  condition: {
    fontStyle: "italic",
    color: "#777",
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25578E",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    marginRight: 5,
  },
});

export default PatientUCard;
