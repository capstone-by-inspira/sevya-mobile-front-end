import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import { getDocumentById, getDocuments, updateDocument } from "@/services/api";
import { getSecureData } from "@/services/secureStorage";
import { useLocalSearchParams } from "expo-router";
import { Card, Divider, Icon, ProgressBar } from "react-native-paper";
import Button from "@/components/ui/Button";
import { formatDateOnly, formatTimeOnly } from "@/services/utils";
import { AppContext } from "@/components/AppContext";
import PatientUCard from "@/components/PatientUCard";

interface Shift {
  id: number;
  caregiverId: number;
  patientId: number;
  startTime: string;
  endTime: string;
  adminId: number;
  status: string;
  checkIn: boolean;
  checkOut: string;
  checkOutTime: string;
  checkInTime: string;
}

interface Patient {
  id: number;
  firstName: string;
  gender: string;
  medicalConditions?: string[];
  image?: any;
}

const ShiftCard: React.FC = () => {
  const [shift, setShift] = useState<Shift | null>(null);
  const [progress, setProgress] = useState(0);
  const [shiftStartButtonDisabled, setshiftStartButtonDisabled] =
    useState(false);
  const [shiftEndButtonDisabled, setshiftEndButtonDisabled] = useState(false);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [location, setLocation] = useState();
  const [shiftTime, setShiftTime] = useState();

  const [checkIn, setCheckIn] = useState(false);

  const { id } = useLocalSearchParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  // console.log("id:::", id);
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }
  const { isAuth, caregivers, patients, shifts, fetchData, token } = context;
  // console.log('shifts:::', shifts);

  const current_shift = shifts.find((shift) => shift.id === id); // taking that shift

  useEffect(() => {
    getShiftDetails();
  }, []);

  useEffect(() => {
   
    if (!current_shift?.startTime || !current_shift?.endTime) return;
    const interval = setInterval(() => {
      updateProgress(current_shift.startTime, current_shift.endTime);
    }, 1000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [current_shift]);

  // const getPatientDetails = (patientId) => {
  //   const patient = patients.find((p) => p.id === patientId);
  //   setPatient(patient);
  // }

  const getShiftDetails = () => {
    if (shifts) {
      const shift = shifts.find((shift) => shift.id === id); // taking that shift
      setShift(shift); // storing that shift

      const patient = patients.find((p: any) => p.id === shift.patientId); // taking that particular patient
      setPatient(patient); // setting the patient

      setLocation(shift.location);
      setShiftTime(shift.startTime);
      setCheckIn(shift.checkIn);
      // getPatientDetails(shift.patientId);

      console.log(shift.checkIn, ">>>>>>>>>>");
      if (shift?.checkIn) {
        console.log("?>>>>>>>>>>");
        setshiftStartButtonDisabled(true);
        setshiftEndButtonDisabled(false);
      } else {
        setshiftStartButtonDisabled(false);
        setshiftEndButtonDisabled(true);
      }
    }
  };

  const handleStartShift = async () => {
    if (!shift) return;
    const currentUtcTime = new Date().toISOString();
    const updateData = {
      ...shift,
      checkInTime: currentUtcTime,
      checkIn: true,
    };
    const updateResult = await updateDocument("shifts", id, updateData, token);
    // console.log("updated", updateResult);
    if (updateResult.success) {
      setCheckIn(true);

      // setShift((prevShift) => prevShift ? { ...prevShift, checkIn: true } : prevShift);
      setShift(updateData);

      setshiftStartButtonDisabled(true);
      setshiftEndButtonDisabled(false);

      updateProgress(shift.startTime, shift.endTime);
      Alert.alert("Confirmation", "Shift started successfully");
    } else {
      Alert.alert("Error", "Failed to update check-in time.");
    }
  };

  const handleEndShift = async () => {
    const token = await getSecureData("token");
    const currentUtcTime = new Date().toISOString();
    const updateData = {
      ...shift,
      checkOutTime: currentUtcTime,
      checkIn: true,
    };
    const updateResult = await updateDocument("shifts", id, updateData, token);
    // console.log("updated", updateResult);
    if (updateResult.success) {
      setshiftEndButtonDisabled(true);
      setshiftStartButtonDisabled(true);
      setProgress(1);
    } else {
      Alert.alert("Error", "Failed to update check-out time.");
    }
  };

  const updateProgress = (start: string, end: string) => {
    console.log('chlya???>>>>>>>>>>>>');

    if (!start || !end) return;

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const now = Date.now();
    // console.log('timers:::', now, startTime, endTime);

    if (shift?.checkIn) {
      if (now >= endTime) {
        setProgress(1);
        setshiftEndButtonDisabled(true);
        setshiftStartButtonDisabled(true);
      } else if (now >= startTime && now < endTime) {
        const progressValue = (now - startTime) / (endTime - startTime);
        setProgress(progressValue);
        setshiftStartButtonDisabled(true);
        setshiftEndButtonDisabled(false);
      } else {
        setProgress(0);
        setshiftStartButtonDisabled(true);
        setshiftEndButtonDisabled(false);
      }
    } else {
      setProgress(0);
      setshiftStartButtonDisabled(false);
      setshiftEndButtonDisabled(true);
    }
  };

  const handleViewSchedule = async () => {
    router.replace("/(tabs)/shifts");
  };

  return (
    <View>
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

      <Divider />

      <View style={styles.progressContainer}>
        <Text style={styles.percentageText}>{Math.round(progress * 100)}%</Text>
        <ProgressBar
          progress={progress}
          color="lightgreen"
          style={styles.progressBar}
        />
      </View>

      <Divider />

      <Text style={styles.shiftInfoHeading}>Shift Information</Text>

      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Icon source="map-marker-outline" size={20} color="#2C3E50" />
            <Text style={styles.cardText}>{location}</Text>
          </View>
          <View style={styles.row}>
            <Icon source="information-outline" size={20} color="#2C3E50" />
            <Text style={styles.cardText}>
              {formatDateOnly(shiftTime)} {formatTimeOnly(shiftTime)}
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
          name={patient?.firstName ?? ""}
          gender={patient?.gender || ""}
          condition={patient?.medicalConditions?.join(", ") ?? ""}
          image={patient?.image} lname={""}        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  progressContainer: {
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
  },
  progressBar: {
    width: 350,
    height: 15,
    borderRadius: 5,
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
});

export default ShiftCard;
