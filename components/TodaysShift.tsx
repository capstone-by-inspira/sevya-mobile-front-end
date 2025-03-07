import React, { useEffect, useState , useContext} from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Divider, Icon } from "react-native-paper";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { getDocumentById, getDocumentByKeyValue } from "@/services/api";
import { getSecureData } from "@/services/secureStorage";
import { formatDateOnly, formatTimeOnly } from "@/services/utils";
import { AppContext } from '../components/AuthGuard';

interface Shift {
  id: number;
  caregiverId: number;
  patientId: number;
  startTime: string;
  endTime: string;
  adminId: number;
  status: string;
}

// interface Caregiver {
//   id: number;
//   name: string;
//   email: string;
// }

// interface Shifts {
//   id: number;
//   name: string;
//   email: string;
// }
// interface ShiftCardProps {
//   shift: Shift;
//   caregiver: Caregiver[] | null;
//   shifts: Shifts[] | null;
// }
const TodaysShift = () => {
    
    const context = useContext(AppContext);

    if (!context) {
        return <Text>Error: AppContext not found</Text>;
      }
    
      const {isAuth, caregivers, patients, shifts, fetchData } = context;

const caregiver = caregivers;
  console.log("agyecaregivers", caregiver);
  console.log("agyeshifts", shifts);
  const [location, setLocation] = useState("");
  const [shiftTime, setShiftTime] = useState("");
  const [shift, setShift] = useState<Shift | null>(shifts);
  const [noShift, setNoShift] = useState(false); // Tracks no shift today

  useEffect(() => {
    getCaregiverShiftData();
    getCaregiverData();
  }, [shifts]);

  const getCurrentDateDDMMYYYY = (): string => {
    return new Date().toLocaleDateString("en-GB");
  };

  const getTodaysShiftData = async (shifts: any[]) => {
    const today = new Date();
    const localDate =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    console.log("result.data::", localDate);
    const todaysShifts = shifts.filter((shift) =>
      shift.startTime.startsWith(localDate)
    );
    console.log("result.data::", todaysShifts);
    if (todaysShifts.length === 0) {
      setNoShift(true);
      return null;
    }

    setNoShift(false);
    return todaysShifts.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )[0];
  };

  const getCaregiverShiftData = async () => {
   
    if (shifts.length != 0) {
      const earliestShift = await getTodaysShiftData(shifts);
      if (earliestShift) {
        console.log("result.data::", earliestShift);
        setShift(earliestShift);
        setLocation(earliestShift.location || "No location provided");
        setShiftTime(earliestShift.startTime || "No time provided");
      }
    } else {
      setNoShift(true);

    }
  };

  const getCaregiverData = async () => {};

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
              handleButtonClick={() => router.push(`/shift/${shift.id}`)}
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
