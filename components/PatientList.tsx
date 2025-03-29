import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import PatientUCard from "./PatientUCard";
import { useRouter } from "expo-router";
import Placeholder from "@/components/Placeholder";

const PatientList = ({ patients, shifts, caregivers }) => {
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  // Simulating data fetching for demo purposes
  useEffect(() => {
    if (patients) {
      setIsLoading(false); // Set loading to false once data is fetched
    }
  }, [patients]);

  const renderPatientCard = ({ item }) => (
    <PatientUCard
      name={item.firstName}
      gender={item.gender}
      condition={item.medicalConditions?.join(", ") || "N/A"}
      image={item.image}
      onPress={() =>
        router.push({
          pathname: `/patients/[id]`,
          params: {
            id: item.id,
            AllShifts: JSON.stringify(shifts),
            AllPatients: JSON.stringify(patients),
            AllCaregivers: JSON.stringify(caregivers),
          },
        })
      }
    />
  );

  return (
    <View>
      <Text style={styles.title}>Patients Under Care</Text>

      {/* Show placeholder while loading */}
      {isLoading ? (
        <Placeholder />
      ) : (
        <FlatList

          data={patients}
          renderItem={renderPatientCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
});

export default PatientList;
