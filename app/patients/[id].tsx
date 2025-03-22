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

import { AppContext } from "../../components/AppContext";
import SevyaLoader from "../../components/SevyaLoader";

const PatientDetails = () => {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  useEffect(() => {
    navigation.setOptions({ title: "Details" }); // ✅ Set Title
  }, [navigation]);

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { isAuth, caregivers, patients, shifts, fetchData } = context;

  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get the patient ID from the URL

  // Make sure `patients` is not empty before trying to find the patient
  const patient = patients.find((p: any) => p.id === id);

  const [patientData, setPatientData] = useState<any>(null); // Initially set to null
  const [loading, setLoading] = useState(true); // Loading state for fetching patient data
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    patientInfo: false,
    medicalInfo: false,
    shifts: false,
  });

  useEffect(() => {
    // If patient data is available, set it to state
    if (patient) {
      setPatientData(patient);
      setLoading(false); // Stop loading once the data is set
    } else {
      setLoading(true); // Keep loading if there's no patient yet
    }
  }, [patient]); // Update when `patient` changes (on first render or data update)

  const toggleSection = (section: string) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    ); // Show loading indicator while fetching data
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!patientData) return <Text>No patient data available.</Text>;

  const generateCaregiverPlan = async () => {
    setLoading(true);
    try {
      // Make the API call to your backend
      const response = await axios.post(
        "http://3.227.60.242:8808/api/auth/generate-health-plan",
        {
          patientData: patientData,
        }
      );

      // Assuming the healthcare plan is in the response's text field
      const generatedPlan =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Failed to generate plan";
      //  console.log(generatedPlan, 'GEENRATED PLAN');
      setLoading(false);

      // Split the plan into bullet points if it's in a text format
      const planArray = generatedPlan
        .split("\n")
        .filter((line) => line.trim() !== "");
      router.push(
        `/patients/CarePlan?plan=${encodeURIComponent(generatedPlan)}`
      );
      setPlan(planArray);
    } catch (error) {
      setError("Error generating healthcare plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container]}>
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
        <TouchableOpacity style={styles.link} onPress={generateCaregiverPlan}>
          <FontAwesome5 name="calendar-alt" size={18} color="#2D5DA3" />
          <Text style={styles.linkText}>
            Generate AI Personalized Care Plan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() =>
            router.push({
              pathname: "/patients/Notes",
              params: { id: patientData.id },
            })
          }
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
    backgroundColor: "#F8FBFF",
  },
  loader: {
    flex: 1, // Take up full screen height
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
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
