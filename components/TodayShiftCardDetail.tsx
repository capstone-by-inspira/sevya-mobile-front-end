import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Card, Divider, Icon, MD3Colors } from 'react-native-paper'
import { formatDateAndMonthOnly, formatDateOnly, formatTimeOnly, formatShiftTimeOnly } from '@/services/utils';
import Button from './ui/Button';
import { router } from 'expo-router';

interface TodayShiftDetailCardProps {
  location: string;
  shiftTime: string;
  shiftEndTime: string;
  shiftId: string;
  shifts: any,
  patients: any
  caregivers:any
}

const TodayShiftDetailCard: React.FC<TodayShiftDetailCardProps> = ({ location, shiftTime, shiftEndTime, shiftId, shifts, patients, caregivers }) => {
  const handleViewMore = () => {
    // router.push(`/shiftTest/${shiftId}`);
    router.push({
      pathname: `/shiftTest/[id]`,
      params: {
        id: shiftId,
        shiftData: JSON.stringify(shifts),
        patientData: JSON.stringify(patients),
        caregiverData:JSON.stringify(caregivers)

      }
    })
  }
  return (
    // <Card style={styles.card}>
    //     <View>
    //         <View style={styles.row}>
    //             {/* <Icon source="map-marker-outline" size={20} color={MD3Colors.primary40} /> */}
    //             <Icon source="map-marker-outline" size={20} color="#2C3E50" />
    //             <Text style={styles.cardText}>{location}</Text>
    //         </View>
    //         <View style={styles.row}>
    //             <Icon source="clock-outline" size={20} color="#2C3E50" />
    //             <Text style={styles.cardText}>{formatDateAndMonthOnly(shiftTime)},  {formatShiftTimeOnly(shiftTime)} - {formatShiftTimeOnly(shiftEndTime)}</Text>
    //         </View>
    //         <View style={styles.buttonContainer}>
    //             <Button
    //                 handleButtonClick={handleViewMore}
    //                 buttonText="View More"
    //                 disabled={false} />
    //         </View>
    //     </View>
    // </Card>
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Icon source="map-marker-outline" size={20} color="#2C3E50" />
          <Text style={styles.cardText}>{location}</Text>
        </View>
        <View style={styles.row}>
          <Icon source="information-outline" size={20} color="#2C3E50" />
          <Text style={styles.cardText}>
            {formatDateAndMonthOnly(shiftTime)},  {formatShiftTimeOnly(shiftTime)} - {formatShiftTimeOnly(shiftEndTime)}
          </Text>
        </View>
      </View>
      <Divider />
      <TouchableOpacity
        style={styles.scheduleButton}
        onPress={handleViewMore}
      >
        {/* <Icon source="calendar" size={18} color="#1E3A8A" /> */}
        <Text style={styles.scheduleText}>View More</Text>
      </TouchableOpacity>
    </Card>
  )
}

export default TodayShiftDetailCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingTop: 14,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 6,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 2px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    marginHorizontal: 16,
    marginVertical: 8,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
})