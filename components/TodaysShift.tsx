import React, { useEffect, useState, useContext } from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Divider, Icon } from "react-native-paper";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { getDocumentById, getDocumentByKeyValue } from "@/services/api";
import { getSecureData } from "@/services/secureStorage";
import { formatDateAndMonthOnly, formatDateOnly, formatShiftTimeOnly, formatTimeOnly } from "@/services/utils";
import { AppContext } from "../components/AppContext";

interface Shift {
  id: number;
  caregiverId: number;
  patientId: number;
  startTime: string;
  endTime: string;
  adminId: number;
  status: string;
  location: string;
}

interface TodayShiftProps {
  shifts: any;
  caregiver: any;
  patients: any;
}

const TodaysShift: React.FC<TodayShiftProps> = ({ shifts, caregiver , patients}) => {
  const [shift, setShift] = useState<Shift | null>(null);
  const [noShift, setNoShift] = useState(true); // Tracks no shift today

  // console.log(shifts,'rr');
  // Log the updated shift and noShift state
  useEffect(() => {
    // console.log("Updated shift:", shift);
  }, [shift]);

  useEffect(() => {
    // console.log("Updated noShift:", noShift);
  }, [noShift]);

  // Get today's date in DD/MM/YYYY format
  const getCurrentDateDDMMYYYY = (): string => {
    return new Date().toLocaleDateString("en-GB");
  };

  // Find today's shift when the shifts prop changes
  useEffect(() => {
    // console.log(shifts, "todayshift >>>>>>");

    if (shifts && shifts.length > 0) {
      const todaysShift = getTodaysShift(shifts);
      if (todaysShift) {
        setShift(todaysShift);
        setNoShift(false);
      } else {
        setNoShift(true);
        setShift(null);
      }
    } else {
      setNoShift(true);
      setShift(null);
    }
  }, [shifts]);

  // Filter and return today's shift
  const getTodaysShift = (shifts: any[]) => {
    const today = new Date().toLocaleDateString("en-GB"); // Get today's date in DD/MM/YYYY format
    const todaysShifts = shifts.filter((shift) => {
      const shiftDate = new Date(shift.startTime).toLocaleDateString("en-GB");
      return shiftDate === today;
    });

    if (todaysShifts.length === 0) {
      return null; // No shift for today
    }

    // Sort by startTime to get the latest shift
    const latestShift = todaysShifts.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )[0];
    return latestShift;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hi, <Text style={styles.boldText}>{caregiver.firstName}</Text>
      </Text>

      {noShift ? (
        <Text style={styles.noShiftText}>No shift for today</Text>
      ) : (
        <>
          {shift && shift.id ? (
            <Button
              handleButtonClick={() =>
                router.push({
                  pathname: `/shiftTest/[id]`,
                  params: { 
                    id: shift.id,  // Pass the id as a query parameter
                    shiftData: JSON.stringify(shifts),
                    patientData:JSON.stringify(patients),  // Pass shift data as a query parameter
                }
                })
              }
              buttonText="Ready for your shift?"
            />
          ) : (
            <Text>No shift details available</Text>
          )}
          <Text style={styles.shiftTitle}>
            <Text style={styles.boldText}>Today's Shift:</Text>{" "}
            {getCurrentDateDDMMYYYY()}
          </Text>

          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.row}>
                <Icon source="map-marker-outline" size={20} color="#2C3E50" />
                <Text style={styles.cardText}>{shift?.location}</Text>
              </View>
              <View style={styles.row}>
                <Icon source="information-outline" size={20} color="#2C3E50" />
                <Text style={styles.cardText}>
                  {formatDateAndMonthOnly(shift?.startTime)},  
                  {formatShiftTimeOnly(shift?.startTime)} - {formatShiftTimeOnly(shift?.endTime)}
                </Text>
              </View>
            </View>
            <Divider />
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => router.replace("/(tabs)/shifts")}
            >
              <Icon source="calendar" size={18} color="#1E3A8A" />
              <Text style={styles.scheduleText}>View Your Schedule</Text>
            </TouchableOpacity>
          </Card>
        </>
      )}
    </View>
  );
};

export default TodaysShift;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 20,
    color: "#000000",
    marginBottom: 10,
    marginTop: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
  noShiftText: {
    fontSize: 26,
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  shiftTitle: {
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
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
    justifyContent: "center",
  },
  scheduleText: {
    color: "#1E3A8A",
    fontWeight: "bold",
    marginVertical: 10,
  },
});
