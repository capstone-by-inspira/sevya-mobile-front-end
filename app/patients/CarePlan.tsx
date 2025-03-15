import React, { useEffect, useState } from "react";

import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

const CarePlan = () => {
  const { plan } = useLocalSearchParams(); // Get patient ID
  const navigation = useNavigation();

//  console.log(plan, 'plan >>>>>>>>>>>>');
  const planArr = [plan];

  useEffect(() => {
    if (plan) {
      navigation.setOptions({ title: `AI Care Plan` }); // Set the header title
   }
  }, [plan, navigation]);

  return (
    plan && (
      <ScrollView style={styles.container}>
        {planArr.map((item, index) => (
          <React.Fragment key={index}>
            <Text style={styles.text}>{item}</Text>
            {index < planArr.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
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
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
});

export default CarePlan;