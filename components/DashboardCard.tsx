import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DashboardCard = ({title, data}) => {
  return (
    <View style={styles.card}>
      <View style={styles.circle}>
        <Text style={styles.number}>{data}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        color: "#1E293B",
        fontFamily: "Lato",
        fontStyle: "normal",
        fontWeight: "700",
        lineHeight: 16,
      
        marginTop: 8,

      },
  card: {
    width: "40%", // Adjust width as needed
    height: 100,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",

    boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 2px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",

  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FBFF",
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 18,
   
    color: "#007BFF",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default DashboardCard;
