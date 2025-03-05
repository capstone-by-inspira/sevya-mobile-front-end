import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import SearchBar from "../../components/SearchBar"; // Import SearchBar component
import PatientCard from "@/components/PatientCard";
import patientsData from "../patients/patientData";

const Patients = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patientsData);

  // Function to handle search
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredPatients(patientsData); // Reset list when empty
    } else {
      const filtered = patientsData.filter((patient) =>
        patient.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>My Patients</Text>

      {/* Search Bar Below the Title */}
      <SearchBar placeholder="Search patients..." value={searchText} onChangeText={handleSearch} />

      {/* ListView of Patients */}
      {filteredPatients.length > 0 ? (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PatientCard
              name={item.name}
              gender={item.gender}
              conditions={item.conditions}
              onPress={() => console.log(`Viewing details for ${item.name}`)}
            />
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No patients found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 14,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
});

export default Patients;
