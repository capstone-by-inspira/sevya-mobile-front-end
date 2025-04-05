import {
  Alert, StyleSheet, Text, TouchableOpacity, View, Modal, FlatList, RefreshControl, ScrollView,
  SafeAreaView,
  SectionList
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import ShiftDetailCard from '@/components/ShiftDetailCard';
import { AppContext } from '@/components/AppContext';
import TodayShiftDetailCard from '@/components/TodayShiftCardDetail';
import { Icon } from 'react-native-paper';
import { formatDateOnly, formatShiftTimeOnly, sendNotification } from '@/services/utils';
import Button from "@/components/ui/Button";
import { capitalize } from '@/services/utils';

const ShiftCard: React.FC = () => {
  const context = useContext(AppContext);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [allShifts, setAllShifts] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [upComingShifts, setUpComingShifts] = useState<any[]>([]);
  const [todayShift, setTodayShift] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false); // Refresh state
  const [today, setToday] = useState('');
  const [patientName, setPatientName] = useState('Patient Name');

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { shifts, caregivers, patients, fetchData, token } = context;


  useEffect(() => {
    markShiftsOnCalendar();
  }, [shifts]);

  const markShiftsOnCalendar = () => {
    const todayDate = new Date().toLocaleDateString("en-CA");
  
    const marks = shifts.reduce((acc: any, shift: any) => {
      const shiftDate = new Date(shift.startTime).toLocaleDateString("en-CA");
      
      const isPast = shiftDate < todayDate;
  
      acc[shiftDate] = {
        selected: true,
        selectedColor: isPast ? "rgba(37, 87, 142, 0.5)" : "#10B981", 
      };
  
      return acc;
    }, {});
  
    setMarkedDates(marks);
    setAllShifts(shifts);
  
    setToday(todayDate);
  
    const todayShiftData = shifts.find((shift: any) =>
      new Date(shift.startTime).toLocaleDateString("en-CA") === todayDate
    );
    setTodayShift(todayShiftData || null);
  
    const upcomingShiftData = shifts
      .filter((shift: any) =>
        new Date(shift.startTime).toLocaleDateString("en-CA") > todayDate
      )
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
    setUpComingShifts(upcomingShiftData);
  };
  

  // Pull-to-refresh function
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
    console.log('refreshing')
  };

  const handleDayPress = (day: any) => {
    const date = day.dateString;
    setSelectedDate(date);
    const filteredShifts = allShifts.filter(shift =>
      new Date(shift.startTime).toLocaleDateString("en-CA") === date
    );

    if (filteredShifts.length > 0) {
      setModalVisible(true);
    } else {
      Alert.alert("No Shifts", "No shifts found for this date.");
    }
  };

  const renderShiftDetailCard = ({ item }: { item: any }) => (
    <ShiftDetailCard location={item.location} shiftTime={item.startTime} shiftEndTime={item.endTime} caregiverFirstname={caregivers.firstName} token={token} />
  );

  const sections = [
    {
      title: 'Shifts Calendar',
      data: [{ key: 'calendar' }]
    },
    {
      title: `Today's Shift`,
      data: todayShift ? [todayShift] : []
    },
    {
      title: 'Next Shifts',
      data: upComingShifts
    },

  ];

  const requestChange = async () =>{
    await sendNotification('Shift Cancellation Request', `Date: ${selectedDate} `, caregivers.firstName, token);
    Alert.alert("Shift Cancellation", `Shift has been requested to cancel.`);
    setModalVisible(false)
  }

  return (

    <SectionList
      style={styles.scrollView}
      sections={sections}
      keyExtractor={(item, index) => item.id || index.toString()}
      renderItem={({ item }) => {
        const itemDate = new Date(item.startTime).toLocaleDateString("en-CA");
        if (item.key === 'calendar') {
          return (
            <View style={styles.container}>
              <Calendar style={styles.calendar} onDayPress={handleDayPress}
                markedDates={{
                  ...markedDates,
                  [today]: {
                    selected: true,
                    selectedColor: "#25578E",
                    marked: true,
                    dotColor: "white",
                  },
                }} />
              <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>

                    <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
                      <Icon source="close" size={18} color="#1E3A8A" />
                    </TouchableOpacity>

                    <FlatList
                      data={allShifts.filter(shift =>
                        new Date(shift.startTime).toLocaleDateString("en-CA") === selectedDate
                      )}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <View style={styles.shiftDetails}>
                          <Text style={styles.detailText}>
                            <Text style={styles.label}>Patient:</Text> {capitalize(patients.find(p => p.id === item.patientId).firstName) || "Patient Name"}
                          </Text>
                          <Text style={styles.detailText}>
                            <Text style={styles.label}>Caregiver:</Text> {capitalize(caregivers.firstName) || "Caregiver Name"} {capitalize(caregivers.lastName) || "Caregiver Name"}
                          </Text>
                          <Text style={styles.detailText}>
                            <Text style={styles.label}>Address:</Text> {item.location}
                          </Text>
                          <Text style={styles.detailText}>
                            <Text style={styles.label}>Date:</Text> {formatDateOnly(item.startTime)}
                          </Text>
                          <Text style={styles.detailText}>
                            <Text style={styles.label}>Start Shift:</Text> {formatShiftTimeOnly(item.startTime)}
                          </Text>
                          <Text style={styles.detailText}>
                            <Text style={styles.label}>End Shift:</Text> {formatShiftTimeOnly(item.endTime)}
                          </Text>
                       <View style={styles.buttonContainer}>
                          <Button handleButtonClick={requestChange} buttonText="Request Shift Cancellation" />
                          </View>
                        </View>
                      )}
                      nestedScrollEnabled={true}
                    />
                  </View>
                </View>
              </Modal>

            </View>

          );
        } else if (todayShift && item.id === todayShift.id && itemDate === today) {
          return <TodayShiftDetailCard location={item.location} shiftTime={item.startTime} shiftEndTime={item.endTime} shiftId={todayShift.id} shifts={shifts} patients={patients} />
        } else {
          return renderShiftDetailCard({ item });
        }

      }}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />

  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#F8FBFF',
  },
  container: {
    paddingHorizontal: 16,
    width: '100%',
  },
  calendar: {
    width: '100%',
    height: 350,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 16,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 2px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  sectionHeader: {
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 16 * 1.3,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FBFF',
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    borderWidth: 1,
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: 'rgba(100, 100, 111, 0.2)', 
    shadowOffset: { width: 0, height: 7 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 29, 
    elevation: 3,
    padding: 0,
    zIndex: 1000, 
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#25578E",
  },
  shiftDetails: {
    marginVertical: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  buttonContainer:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:14,
  }
});

export default ShiftCard;