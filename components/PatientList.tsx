import { View, Text, FlatList } from "react-native";
import React from "react";
import PatientUCard from "./PatientUCard";
import { useRouter } from "expo-router";

const PatientList = ({ patients }) => {
  const router = useRouter();

  const renderPatientCard = ({ item }) => (
    <PatientUCard
      name={item.firstName}
      gender={item.gender}
      condition={item.medicalConditions?.join(", ") || "N/A"}
      image={item.image}
      onPress={() => router.push(`/patients/${item.id}`)}
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
