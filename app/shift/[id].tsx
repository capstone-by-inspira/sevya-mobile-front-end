import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import { getDocumentById, getDocuments, updateDocument } from "@/services/api";
import { getSecureData } from "@/services/secureStorage";
import { useLocalSearchParams } from "expo-router";
import { Card, Divider, Icon, ProgressBar } from "react-native-paper";
import Button from "@/components/ui/Button";
import { formatDateOnly, formatTimeOnly } from "@/services/utils";

interface Shift {
  id: number;
  caregiverId: number;
  patientId: number;
  startTime: string;
  endTime: string;
  adminId: number;
  status: string;
  checkIn: string;
  checkOut: string;
}


const ShiftCard: React.FC = () => {
  const [shift, setShift] = useState<Shift | null>(null);
  const [progress, setProgress] = useState(0);
  const [shiftStarted, setShiftStarted] = useState(false);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [location, setLocation] = useState();
  const [shiftTime, setShiftTime] = useState();
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("id:::", id);

  useEffect(() => {
    getShiftDetails();
    updateProgress();
  }, []);

  const getShiftDetails = async () => {
    const token = await getSecureData("token");
    if (!token) {
      Alert.alert("Error", "No authentication token found. Please log in.");
      return;
    }
    if (id) {
      const result = await getDocumentById("shifts", id, token);
      if (result.success) {
        setShift(result.data);
        setLocation(result.data.location);
        setShiftTime(result.data.startTime);
        !!result.data.checkIn ? setShiftStarted(true) : setShiftStarted(false);
      } else {
        console.error("API Error:", result.error);
        Alert.alert("API Error", result.error);
      }
    }
  };

  const handleStartShift = async () => {
    updateProgress();

    if (!shift) return;
    // const token = await getSecureData("token");
    // const currentUtcTime = new Date().toISOString();
    // const updateData = {
    //   ...shift,
    //   checkInTime: currentUtcTime,
    //   checkIn: true,
    // };
    // const updateResult = await updateDocument("shifts", id, updateData, token);
    // console.log("updated", updateResult);
    // if (updateResult.success) {
    //   setShiftStarted(true);
    //   updateProgress();
    // } else {
    //   Alert.alert("Error", "Failed to update check-in time.");
    // }
    
  };

  const handleEndShift = () => {
    setShiftStarted(false);
    setProgress(0);
  };

  const updateProgress = () => {
    console.log("time::::");
    if (!shift) return;
    const startTime = new Date(shift.startTime).getTime();
    const endTime = new Date(shift.endTime).getTime();
    const now = Date.now();
    // const now = new Date('2025-03-05T08:24:50.773Z').getTime();
    console.log("time::::", startTime, endTime, now);
    // if (now >= endTime) {
    //   setProgress(1);
    //   setShiftStarted(false);
    // } else {
    //   console.log(now, "now");
    //   console.log(startTime, "startTime");
    //   console.log(endTime, "endTime");

    //   const progressValue = (now - startTime) / (endTime - startTime);
    //   setProgress(progressValue);
    //   setShiftStarted(true);
    // }

    if (now >= endTime) {
      setProgress(1); // Shift is complete
      setShiftStarted(false); // Optional: Mark shift as finished
  } else if (now <= startTime) {
      setProgress(0); // Shift hasn't started yet
      setShiftStarted(false);
  } else {
      const progressValue = (now - startTime) / (endTime - startTime);
      console.log(progressValue,'PROFRESS')
      setProgress(progressValue); // No need to divide by 100
      setShiftStarted(true);
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
          disabled={shiftStarted}
        />
        <Button
          handleButtonClick={handleEndShift}
          buttonText="End Shift"
          disabled={!shiftStarted}
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
});

export default ShiftCard;
