import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import axios from "axios";

import { AppContext } from "@/components/AppContext";
import SevyaLoader from "@/components/SevyaLoader";
import {API_URL} from '@/services/api'
console.log(API_URL, 'ID');

const PatientDetails = () => {

  const context = useContext(AppContext);
  const navigation = useNavigation();

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const {fetchData } = context;


  const router = useRouter();
  const { id , AllShifts, AllPatients, AllCaregivers} = useLocalSearchParams(); // Get the patient ID from the URL

  const shiftDataString = Array.isArray(AllShifts) ? AllShifts[0] : AllShifts;
  const patientDataString = Array.isArray(AllPatients)
    ? AllPatients[0]
    : AllPatients;

    const caregiverDataString = Array.isArray(AllCaregivers)
    ? AllCaregivers[0]
    : AllCaregivers;

  const [shifts, setShifts] = useState(JSON.parse(shiftDataString));
  const [patients, setPatients] = useState(JSON.parse(patientDataString));
  const [caregivers, setCaregivers] = useState(JSON.parse(caregiverDataString));

  const patient = patients.find((p:any) => p.id === id);

  const [patientData, setPatientData] = useState<any>(patient);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    patientInfo: false,
    medicalInfo: false,
    shifts: false,
  });

  useEffect(() => {
        if (patientData) {
          navigation.setOptions({ title: patientData.firstName }); // Set the header title
       }
      }, [patientData, navigation]);

  // Toggle dropdown sections
  const toggleSection = (section: string) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!patientData) return <Text>No patient data available.</Text>;



   const generateCaregiverPlan = async () =>{
    setLoading(true);
    try {
      // Make the API call to your backend
      const response = await axios.post(`${API_URL}/auth/generate-health-plan`, {
        patientData: patientData,
      });

      // Assuming the healthcare plan is in the response's text field
      const generatedPlan = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to generate plan';
    //  console.log(generatedPlan, 'GEENRATED PLAN');
      setLoading(false);
      
      // Split the plan into bullet points if it's in a text format
      const planArray = generatedPlan.split('\n').filter(line => line.trim() !== '');
      router.push({ pathname:"/patients/CarePlan", params: { plan: generatedPlan }})
      setPlan(planArray);
    } catch (error) {
      setError('Error generating healthcare plan');
    } finally {
      setLoading(false);
    }

  
  }

  return (
    <View style={styles.container}>
      <SevyaLoader visible={loading} />
      {/* Patient Info */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection("patientInfo")}
      >
        <Text style={styles.sectionTitle}>Patient Info</Text>
        <AntDesign
          name={expandedSections.patientInfo ? "minus" : "plus"}
          size={20}
        />
      </TouchableOpacity>
      {expandedSections.patientInfo && (
        <View style={styles.sectionContent}>
          <Text>Name: {patientData.firstName}</Text>
          <Text>Age: {patientData.age ?? "N/A"}</Text>
          <Text>Phone: {patientData.phoneNumber}</Text>
        </View>
      )}

      {/* Medical Info */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection("medicalInfo")}
      >
        <Text style={styles.sectionTitle}>Medical Info</Text>
        <AntDesign
          name={expandedSections.medicalInfo ? "minus" : "plus"}
          size={20}
        />
      </TouchableOpacity>
      {expandedSections.medicalInfo && (
        <View style={styles.sectionContent}>
          <Text>
            Conditions: {patientData.medicalConditions?.join(", ") || "N/A"}
          </Text>
          <Text>
            Medications: {patientData.medications?.join(", ") || "N/A"}
          </Text>
        </View>
      )}

      {/* Scheduled Shifts */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection("shifts")}
      >
        <Text style={styles.sectionTitle}>Scheduled Shifts</Text>
        <AntDesign
          name={expandedSections.shifts ? "minus" : "plus"}
          size={20}
        />
      </TouchableOpacity>
      {expandedSections.shifts && (
        <View style={styles.sectionContent}>
          {patientData.shifts && Object.keys(patientData.shifts).length > 0 ? (
            Object.entries(patientData.shifts).map(
              ([time, shift]: [string, any], index) => (
                <Text key={index}>
                  ⏰ {time}: {shift.firstName} ({shift.shiftDate})
                </Text>
              )
            )
          ) : (
            <Text>No shifts available.</Text>
          )}
        </View>
      )}

      {/* Bottom Navigation Links */}
      <View style={styles.bottomLinks}>
        <TouchableOpacity
          style={styles.link}
          onPress= {generateCaregiverPlan}
        >
          <FontAwesome5 name="calendar-alt" size={18} color="#2D5DA3" />
          <Text style={styles.linkText}>Generate AI Personalized Care Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push({ pathname: "/patients/Notes", params: {id:id, singlePatientData:JSON.stringify(patient), singleCaregiverData : AllCaregivers}})}
        >
          
          <FontAwesome5 name="calendar-alt" size={18} color="#2D5DA3" />
          <Text style={styles.linkText}>View Notes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomLinks: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#f8f9fa",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  linkText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#2D5DA3",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default PatientDetails;
