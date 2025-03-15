import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl , SafeAreaView } from "react-native";
import SearchBar from "../../components/SearchBar"; // Import SearchBar component
import PatientCard from "@/components/PatientCard";
import { useRouter } from "expo-router";
import { getSecureData } from "../../services/secureStorage"; // Import secure storage function
import { AppContext } from "../../components/AppContext";

const Patients = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { isAuth, caregivers, patients, shifts, fetchData } = context;

  // State for search and refresh
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);

  const router = useRouter();

  // Fetch new data on pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(); // Reload data
    setRefreshing(false);
  }, [fetchData]);

  // Update filteredPatients when patients list changes
  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  // Function to fetch stored user data
  useEffect(() => {
    const fetchStoredUserData = async () => {
      try {
        const storedUser = await getSecureData("user");
        if (storedUser) {
          JSON.parse(storedUser);
        }
      } catch (error) {
        console.error("Error fetching stored user data:", error);
      }
    };
    fetchStoredUserData();
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    // if (userData?.uid) {
      const userID = "oP0l5aPKimWP2im6fPQFa68wmb83"
      fetchPatients(userID);
      // fetchPatients(userData.uid);
    // }
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

=======
  // Search handler
>>>>>>> main
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter(
          (patient) =>
            patient.firstName &&
            patient.firstName.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  // Navigate to patient details
  const handlePatientPress = (id: string) => {
  //  console.log(id);
    router.push(`/patients/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>My Patients</Text>
      <SearchBar
        placeholder="Search patients..."
        value={searchText}
        onChangeText={handleSearch}
      />
      {filteredPatients.length > 0 ? (
        <FlatList
          data={filteredPatients} // ✅ Pass filteredPatients instead of patients
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PatientCard
              name={item.firstName}
              gender={item.lastName}
              conditions={item.medicalConditions}
              onPress={() => handlePatientPress(item.id)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.noDataText}>No patients found</Text>
      )}
    </View>
    </SafeAreaView>
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
