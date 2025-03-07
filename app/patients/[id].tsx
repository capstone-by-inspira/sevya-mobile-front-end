import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import patientData2 from "../patients/patientData2";
import PatientUCard from "@/components/PatientUCard";

const PatientDetails = ({patients}) => {
  const router = useRouter();
  const myPatient = patientData2[0]; 
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    patientInfo: false,
    medicalInfo: false,
    tasks: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <View style={styles.container}>
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
          <Text>Name: John Doe</Text>
          <Text>Age: 45</Text>
          <Text>Phone: 987654321</Text>
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
          <Text>Conditions: Hypertension, Diabetes</Text>
          <Text>Medications: Saridon</Text>
        </View>
      )}

      {/* Scheduled Tasks & Reminders */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection("tasks")}
      >
        <Text style={styles.sectionTitle}>Scheduled Tasks & Reminders</Text>
        <AntDesign name={expandedSections.tasks ? "minus" : "plus"} size={20} />
      </TouchableOpacity>
      {expandedSections.tasks && (
        <View style={styles.sectionContent}>
          <Text style={styles.taskTitle}>Today's Tasks:</Text>
          <Text>- Morning Medication – 8:00 AM (Completed)</Text>
          <Text>- Physical Therapy – 2:00 PM (Upcoming)</Text>
          <Text>- BP Check – 6:00 PM (Upcoming)</Text>
        </View>
      )}

      {/* Bottom Navigation Links */}
      <View style={styles.bottomLinks}>
        <TouchableOpacity
          style={styles.link}
          onPress={() =>
            // navigation.navigate('CarePlan')}
            router.push("/patients/CarePlan")
          }
        >
          <FontAwesome5 name="calendar-alt" size={18} color="#2D5DA3" />
          <Text style={styles.linkText}>Generate Personalized Care Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={
            () => router.push("/patients/Notes")
            // navigation.navigate("Notes")
          }
        >
          <FontAwesome5 name="calendar-alt" size={18} color="#2D5DA3" />
          <Text style={styles.linkText}>View Notes</Text>
        </TouchableOpacity>
      </View>

      <PatientUCard
        name={myPatient.name}
        gender={myPatient.gender}
        image={myPatient.image}
        condition={myPatient.condition}
      ></PatientUCard>
    </View>
  );
};

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
  taskTitle: {
    fontWeight: "bold",
    marginBottom: 5,
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
});

export default PatientDetails;
