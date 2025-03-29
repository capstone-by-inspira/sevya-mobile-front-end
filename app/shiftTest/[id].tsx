import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { updateDocument } from "@/services/api";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Card, Divider, Icon, ProgressBar } from "react-native-paper";
import Button from "@/components/ui/Button";
import { formatDateOnly, formatTimeOnly ,sendNotification} from "@/services/utils";
import { AppContext } from "@/components/AppContext";
import PatientUCard from "@/components/PatientUCard";
import ConfettiCannon from 'react-native-confetti-cannon';

interface Shift {
  id: number;
  caregiverId: number;
  patientId: number;
  startTime: string;
  endTime: string;
  adminId: number;
  status: string;
  checkIn: boolean;
  checkOut: boolean;
  checkOutTime: string;
  checkInTime: string;
  location?: string;
}

interface Patient {
  id: number;
  firstName: string;
  gender: string;
  medicalConditions?: string[];
  image?: any;
}

const ShiftCheckIn: React.FC = () => {
  const { id, shiftData, patientData } = useLocalSearchParams();
  const navigation = useNavigation();


  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { token, caregivers, fetchData } = context;

  const shiftDataString = Array.isArray(shiftData) ? shiftData[0] : shiftData;
  const patientDataString = Array.isArray(patientData)
    ? patientData[0]
    : patientData;

  const [shifts, setShifts] = useState(JSON.parse(shiftDataString));
  const [patients, setPatients] = useState(JSON.parse(patientDataString));


  const curr_shift = shifts.find((s:any) => s.id === id);
  console.log(curr_shift, 'ttttt');


  const [shift, setShift] = useState<Shift | null>(curr_shift);
  const [associatedPatient, setAssociatedPatient] = useState<Patient | null>(
    null
  );
  const [shiftStartButtonDisabled, setShiftStartButtonDisabled] =
    useState(curr_shift.checkIn);
  const [shiftEndButtonDisabled, setShiftEndButtonDisabled] = useState(curr_shift.checkOut);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);



  // Find the shift and associated patient based on the ID
  useEffect(() => {
    const currentShift = shifts.find((s) => s.id === id);
    const associatedPatientData = patients.find(
      (p) => p.id === currentShift?.patientId
    );

    if (currentShift) {
      setShift(currentShift);
      setShiftStartButtonDisabled(currentShift.checkIn);
      setShiftEndButtonDisabled(currentShift.checkOut);
    }

    if (associatedPatientData) {
      setAssociatedPatient(associatedPatientData);
    }
  }, [id, shifts, patients]);

  useEffect(() => {
    if (shift) {
        console.log('workig', formatDateOnly(shift.startTime));

      navigation.setOptions({ title: formatDateOnly(shift.startTime).toString() }); // Set the header title
   }
  }, [shift, navigation]);

  useEffect(() => {
    if (!shift) return; // Ensure shift is not null

    if (shift.checkIn === false) {
      // shift checkin = false from backend
      return;
    }

    if (shift.checkIn === true && shift.checkOut === true) {
      setShiftStartButtonDisabled(true);
      setShiftEndButtonDisabled(true);
      setProgress(1);
      return;
    }

    setShiftStartButtonDisabled(true);
    setShiftEndButtonDisabled(false);

    const interval = setInterval(() => {
      updateProgress(shift); // Now it's safe to call updateProgress
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [shift]);

  const updateProgress = (shift: Shift) => {
    const start = shift.startTime;
    const end = shift.endTime;
    if (!start || !end) return;

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const now = Date.now();

    if (now >= endTime) {
      setProgress(1);
    } else if (now >= startTime && now < endTime) {
      const progressValue = (now - startTime) / (endTime - startTime);
      setProgress(progressValue);
    } else {
      setProgress(0);
    }
  };

  const handleStartShift = async () => {
    if (!shift) return;

    const currentUtcTime = new Date().toISOString();
    const updateData = {
      ...shift,
      checkInTime: currentUtcTime,
      checkIn: true,
      checkOut: false,
    };

    try {
      const updateResult = await updateDocument(
        "shifts",
        id,
        updateData,
        token
      );
      if (updateResult.success) {
        setShift(updateData);
        fetchData();
        await sendNotification('Shift Started', 'shift has been started  ', caregivers.firstName, token);

        Alert.alert("Confirmation", "Shift started successfully");
      } else {
        Alert.alert("Error", "Failed to update check-in time.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleEndShift = async () => {
    if (!shift) return;

    const currentUtcTime = new Date().toISOString();
    const updateData = {
      ...shift,
      checkOutTime: currentUtcTime,
      checkOut: true,
    };

    try {
      const updateResult = await updateDocument(
        "shifts",
        id,
        updateData,
        token
      );
      if (updateResult.success) {
        setShift(updateData);
        setProgress(1);
        fetchData();
        setShowConfetti(true);

        await sendNotification('Shift ended', 'shift has been ended', caregivers.firstName, token);
       
        setTimeout(() => setShowConfetti(false), 10000);

        Alert.alert("Confirmation", "Shift ended successfully");
      } else {
        Alert.alert("Error", "Failed to update check-out time.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleViewSchedule = () => {
    router.replace("/(tabs)/shifts");
  };

  if (!shift || !associatedPatient) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
        {showConfetti && (
            <View style={styles.confettiContainer}>
        <ConfettiCannon 
        count={100} 
        origin={{ x: 50, y: 1000 }} // Confetti starts from a different position
        autoStart={true} // Start immediately
        explosionSpeed={2000} // Speed of explosion
        fallSpeed={2000} // Speed of falling
        fadeOut={true}
        />
        </View>
      )}
      <Divider />
      <View style={styles.buttonContainer}>
        <Button
          handleButtonClick={handleStartShift}
          buttonText="Start Shift"
          disabled={shiftStartButtonDisabled}
        />
        <Button
          handleButtonClick={handleEndShift}
          buttonText="End Shift"
          disabled={shiftEndButtonDisabled}
        />
      </View>



      <View style={styles.progressContainer}>
        <Text style={styles.percentageText}>{Math.round(progress * 100)}%</Text>
        <ProgressBar
          progress={progress}
          color="#10B981"
          style={styles.progressBar}
        />
      </View>

      <Divider />

      <Text style={styles.shiftInfoHeading}>Shift Information</Text>

      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Icon source="map-marker-outline" size={20} color="#2C3E50" />
            <Text style={styles.cardText}>{shift.location}</Text>
          </View>
          <View style={styles.row}>
            <Icon source="information-outline" size={20} color="#2C3E50" />
            <Text style={styles.cardText}>
              {formatDateOnly(shift.startTime)} {formatTimeOnly(shift.endTime)}
            </Text>
          </View>
        </View>
        <Divider />

        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleViewSchedule}
        >
          <Icon source="calendar" size={18} color="#1E3A8A" />
          <Text style={styles.scheduleText}>View Your Schedule</Text>
        </TouchableOpacity>
      </Card>
      <Divider />

      <Text style={styles.shiftInfoHeading}>Your Patients</Text>
      <View style={styles.patientList}>
        <PatientUCard
          name={associatedPatient.firstName}
          gender={associatedPatient.gender}
          condition={associatedPatient.medicalConditions?.join(", ") || ""}
          image={associatedPatient.image}
          onPress={() => router.push({
            pathname: `/patients/[id]`,
            params: {
              id: associatedPatient.id,  // Pass the id as a query parameter
              AllShifts: JSON.stringify(shiftData),
              AllPatients: JSON.stringify(patientData),  // Pass shift data as a query parameter
              AllCaregivers: JSON.stringify(caregivers)
            }
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FBFF',
    height: '100%',
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  progressContainer: {
    alignItems: "center",
    // marginVertical: 10,
    marginBottom:10,
    padding: 10,
  },
  progressBar: {
    width: 350,
    height: 15,
    borderRadius: 95,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#25578E",  
  },

  percentageText: {
    position: "absolute",
    top: 5,
    fontWeight: "bold",
    fontSize: 14,
    color: "#25578E",
  },
  shiftInfoHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    elevation: 2,
  },
  cardContent: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
  scheduleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
    justifyContent: "center",
  },
  scheduleText: {
    color: "#1E3A8A",
    fontWeight: "bold",
    marginLeft: 5,
    marginVertical: 10,
  },
  patientList: {
    marginHorizontal: 20,
  },
  confettiContainer:{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Ensures it's on top
    elevation: 9999, // For Android compatibility
    pointerEvents: "none", // Allows button presses to go through
  }
});

export default ShiftCheckIn;
