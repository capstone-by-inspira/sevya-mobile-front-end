import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CarePlan = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personalized Care Plan</Text>
      <Text style={styles.content}>Here is the generated care plan for the patient...</Text>
      {/* Add dynamic content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default CarePlan;
