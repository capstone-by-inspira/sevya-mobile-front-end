import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import PatientUCard from "./PatientUCard";
import { useRouter } from "expo-router";

const PatientList = ({ patients, shifts, caregivers }) => {
  const router = useRouter();

  const renderPatientCard = ({ item }) => (
    <PatientUCard
      name={item.firstName}
      gender={item.gender}
      condition={item.medicalConditions?.join(", ") || "N/A"}
      image={item.image}
      onPress={() => router.push({
        pathname: `/patients/[id]`,
        params: {
          id: item.id,  // Pass the id as a query parameter
          AllShifts: JSON.stringify(shifts),
          AllPatients: JSON.stringify(patients),  // Pass shift data as a query parameter
          AllCaregivers: JSON.stringify(caregivers)
        }
      })}
    />
  );

  return (
    <View>
      <Text style={styles.title}>Patients Under Care</Text>
      <FlatList
        data={patients}
        renderItem={renderPatientCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "#1E293B",
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  }
});

export default PatientList;
