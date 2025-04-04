import React, { useEffect, useState, useContext } from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Divider, Icon } from "react-native-paper";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { getDocumentById, getDocumentByKeyValue } from "@/services/api";
import { getSecureData } from "@/services/secureStorage";
import {
  formatDateAndMonthOnly,
  formatDateOnly,
  formatShiftTimeOnly,
  formatTimeOnly,
} from "@/services/utils";
import { AppContext } from "../components/AppContext";
import { sendNotification , capitalize} from "@/services/utils";
import DashboardCard from "./DashboardCard";

interface Shift {
  id: number;
  caregiverId: number;
  patientId: number;
  startTime: string;
  endTime: string;
  adminId: number;
  status: string;
  location: string;
  checkIn: boolean;
  checkOut: boolean;
}

interface TodayShiftProps {
  shifts: any;
  caregiver: any;
  patients: any;
  token: any;
}

const TodaysShift: React.FC<TodayShiftProps> = ({
  shifts,
  caregiver,
  patients,
  token,
}) => {
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
    const today = new Date().toLocaleDateString("en-CA"); // Get today's date in DD/MM/YYYY format
    const todaysShifts = shifts.filter((shift) => {
      const shiftDate = new Date(shift.startTime).toLocaleDateString("en-CA");
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

  const reqTodayShift = async () => {
    const today = new Date().toLocaleDateString("en-CA");

    await sendNotification(
      "Shift Request",
      `Shift has been requested for ${today}`,
      caregiver.firstName,
      token
    );
    Alert.alert("Shift Requested", `Shift has been requested for ${today}`);

  };
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hi {capitalize(caregiver.firstName)}

        {shift && shift.id ? (
  shift.checkIn && shift.checkOut ? (
    <Text className="text-green-600 font-semibold">, Shift completed!</Text>
  ) : (
    <Text className="text-blue-600 font-semibold">, Ready for your shift?</Text>
  )
) : (
  <Text> </Text> // fallback or nothing
)}
      </Text>

      <View style={styles.analytics}>
        <DashboardCard title={"Time Off"} data={1} />
        <DashboardCard title={"Shift Covered"} data={shifts.length} />
      </View>

      {noShift ? (
        <View style={styles.noShiftContainer}>
          <Divider />
          <View style={styles.buttonShift}>
            <Text style={styles.shiftTitle}>
              <Text style={styles.boldText}>Today's Date: </Text>{" "}
              {getCurrentDateDDMMYYYY()}
            </Text>

            <Button
              handleButtonClick={reqTodayShift}
              buttonText="Request shift"
              style={{ width: "auto" }}
            />
          </View>

          <Card style={styles.card}>
            <View style={styles.cardContentNoShift}>
              <View style={styles.row}>
                <Icon source="information-outline" size={20} color="#2C3E50" />
                <Text style={styles.cardText}>No shift for today</Text>
              </View>
            </View>
            <Divider />
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => router.replace("/(tabs)/shifts")}
            >
              <Icon source="calendar" size={18} color="#1E3A8A" />
              <Text style={styles.scheduleText}>View Future Shifts</Text>
            </TouchableOpacity>
          </Card>
        </View>
      ) : (
        //   <Card style={styles.card}>
        // <Text style={styles.noShiftText}>No shift for today</Text>
        // </Card>
        <>
          <View style={styles.noShiftContainer}>
            <Divider />
           
            <View style={styles.buttonShift}>
            <Text style={styles.shiftTitle}>
              <Text style={styles.boldText}>Today's Shift: </Text>{" "}
              {getCurrentDateDDMMYYYY()}
            </Text>
              {shift && shift.id ? (
                // Check if checkIn and checkout are both true
                shift?.checkIn && shift?.checkOut ? (
                
                    <Text style={styles.shiftTitleGreen}>Shift Completed</Text>

                  
                ) : (
                  <Button
                    handleButtonClick={() =>
                      router.push({
                        pathname: `/shiftTest/[id]`,
                        params: {
                          id: shift.id, // Pass the id as a query parameter
                          shiftData: JSON.stringify(shifts),
                          patientData: JSON.stringify(patients),
                          token:token // Pass shift data as a query parameter
                        },
                      })
                    }
                    buttonText="Check in"
                    style={{ width: 95 }}
                  />
                )
              ) : (
                <Text>No shift details available</Text>
              )}
            </View>
          </View>

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
                  {formatShiftTimeOnly(shift?.startTime)} -{" "}
                  {formatShiftTimeOnly(shift?.endTime)}
                </Text>
              </View>
            </View>
            <Divider />
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => router.replace("/(tabs)/shifts")}
            >
              <Icon source="calendar" size={18} color="#1E3A8A" />
              <Text style={styles.scheduleText}>View Your Shift</Text>
            </TouchableOpacity>
          </Card>
        </>
      )}
    </View>
  );
};

export default TodaysShift;

const styles = StyleSheet.create({
  noShiftContainer: {
    marginTop: 30,
  },
  analytics: {
    marginTop:20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap:10,
  
  
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  greeting: {
    color: "#000",
    marginBottom: 10,
    marginTop: 20,
    fontFamily: "Lato",
    fontSize: 22, // 16
    fontStyle: "normal",
    fontWeight: "700",
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  buttonShift: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    flexDirection: "row",
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
    marginVertical: 20,
  },
  shiftTitleGreen:{
    fontSize: 16,
    color: "#000000",
    marginVertical: 20,

  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingTop: 14,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 6,
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 2px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  cardContentNoShift: {
    display: "flex",

    flexDirection: "row",

    marginBottom: 10,
    height: 60,
  },
  cardContent: {
    display: "flex",

    flexDirection: "column",

    marginBottom: 10,
    height: 60,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 8,
    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 24,
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
