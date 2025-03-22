import { View, Text, FlatList } from "react-native";
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

export default PatientList;
