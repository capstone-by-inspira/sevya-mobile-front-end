import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import SearchBar from "../../components/SearchBar"; 
import PatientCard from "@/components/PatientCard";
import { useRouter } from "expo-router";
import { getSecureData } from "../../services/secureStorage"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../FirebaseConfig"; 

const Patients = () => {
  const [searchText, setSearchText] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStoredUserData = async () => {
      try {
        const storedUser = await getSecureData("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
        }
      } catch (error) {
        console.error("Error fetching stored user data:", error);
      }
    };
    fetchStoredUserData();
  }, []);

  useEffect(() => {
    if (userData?.uid) {
      fetchPatients(userData.uid);
    }
    // console.log('====================================');
    // console.log(userData?.uid);
    // console.log('====================================');
  }, [userData]);

  const fetchPatients = async (uid: string) => {
    try {
      // console.log("111==");
      // console.log("1=="+uid);
      
      const q = query(collection(db, "patients"), where("caregiverAssigned", "==", uid));
      // console.log("122==");
      const querySnapshot = await getDocs(q);
      // console.log("133==");
      const patientsList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Unknown",
          firstName: data.firstName || "N/A",
          lastName: data.lastName || "N/A",
          email: data.email || "N/A",
          phone: data.phone || "N/A",
          admissionDate: data.admissionDate || "",
          dischargeDate: data.dischargeDate || "",
          caregiverAssigned: data.caregiverAssigned || "",
          createdAt: data.createdAt || 0,
          emergencyContact: data.emergencyContact || { name: "", phone: "" },
          insuranceDetails: data.insuranceDetails || { provider: "", policyNumber: "" },
          medicalConditions: data.medicalConditions || [],
          medications: data.medications || [],
          shifts: data.shifts || [],
        };
      });

      // console.log("11111111");
      // console.log('====================================');
      // console.log(patientsList);
      // console.log('====================================');
      // console.log("22222222");
      
      setPatients(patientsList);
      setFilteredPatients(patientsList);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter((patient) =>
          patient.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const handlePatientPress = (id: string) => {
    router.push(`/patients/${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Patients</Text>
      <SearchBar
        placeholder="Search patients..."
        value={searchText}
        onChangeText={handleSearch}
      />
      {filteredPatients.length > 0 ? (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PatientCard
              name={item.firstName}
              gender={item.lastName}
              conditions={item.medicalConditions}
              onPress={() => handlePatientPress(item.id)}
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
