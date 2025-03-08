import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";


const CarePlan = () => {
  const { plan } = useLocalSearchParams(); // Get patient ID

  console.log(plan, 'plan >>>>>>>>>>>>');
  const planArr =[plan]
  return (
    plan && (
      <ScrollView style={styles.container}>
      {planArr.map((item, index) => (
        <Text key={index} style={styles.text}>
          {item}
        </Text>
      ))}
    </ScrollView>

    )
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
});

export default CarePlan;
