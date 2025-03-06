import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import SearchBar from "../../components/SearchBar"; // Import SearchBar component
import PatientCard from "@/components/PatientCard";
import patientsData from "../patients/patientData";
import { useRouter } from 'expo-router';
import { getSecureData } from '../../services/secureStorage'; // Import the secure storage function

const Patients = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patientsData);
  const [userData, setUserData] = useState<any>(null); // Store user data
  const router = useRouter();

  useEffect(() => {
    const fetchStoredUserData = async () => {
      try {
        // Retrieve stored user data from secure storage
        const storedUser = await getSecureData("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser)); // Parse and set user data
        }
        console.log('====================================');
        console.log(userData);
        console.log('====================================');
      } catch (error) {
        console.error("Error fetching stored user data", error);
      }
    };

    fetchStoredUserData(); // Fetch stored data when the component mounts
  }, []); // Empty dependency array means this effect runs once on mount

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

  // Navigate to PatientDetails screen using router.push
  const handlePatientPress = (id: string) => {
    router.push(`/patients/${id}`); // Navigate to dynamic route based on id
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Patients</Text>

      {/* Conditionally render user data */}
      {/* {userData ? (
        <Text style={styles.userInfo}>Welcome, {userData.name}</Text> // Display user data (example)
      ) : (
        <Text style={styles.loadingText}>Loading user data...</Text> // Display loading text while fetching data
      )} */}

      <SearchBar placeholder="Search patients..." value={searchText} onChangeText={handleSearch} />

      {filteredPatients.length > 0 ? (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PatientCard
              name={item.name}
              gender={item.firstName}
              conditions={item.medicalConditions}
              onPress={() => handlePatientPress(item.id)} // Pass id to navigate
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
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
});

export default Patients;
