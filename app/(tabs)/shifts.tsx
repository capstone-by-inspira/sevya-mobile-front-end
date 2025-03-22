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
import { formatDateOnly, formatShiftTimeOnly } from '@/services/utils';

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

  const { shifts, caregivers, patients, fetchData } = context;

  console.log('patients in shifts', patients);

  useEffect(() => {
    markShiftsOnCalendar();
  }, [shifts]);

  const markShiftsOnCalendar = () => {
    const marks = shifts.reduce((acc: any, shift: any) => {
      console.log('dates startTime', shift.startTime, shift.shiftDate);
      const shiftDate = new Date(shift.startTime).toLocaleDateString("en-CA"); // Extract YYYY-MM-DD
      console.log('dates', shiftDate);
      acc[shiftDate] = { selected: true, selectedColor: "#578FCA" };
      return acc;
    }, {});
    console.log('shifts in calendar', shifts);

    setMarkedDates(marks);
    setAllShifts(shifts);

    const todayLocal = new Date().toLocaleDateString("en-CA");
    setToday(todayLocal);

    const todayShiftData = shifts.find((shift: any) =>
      new Date(shift.startTime).toLocaleDateString("en-CA") === todayLocal
    );
    setTodayShift(todayShiftData || null); // Set to null if no shift found

    const upcomingShiftData = shifts
      .filter((shift: any) =>
        new Date(shift.startTime).toLocaleDateString("en-CA") > todayLocal
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
    <ShiftDetailCard location={item.location} shiftTime={item.startTime} shiftEndTime={item.endTime} />
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
                            <Text style={styles.label}>Patient:</Text> {patients.find(p => p.id === item.patientId).firstName || "Patient Name"}
                          </Text>
                          <Text style={styles.detailText}>
                            <Text style={styles.label}>Caregiver:</Text> {caregivers.firstName || "Caregiver Name"}
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
    paddingTop: 75,
    backgroundColor: '#F8FBFF',
  },
  container: {
    paddingHorizontal: 16,
    width: '100%',
  },
  calendar: {
    width: '100%',
    height: 370,
    borderRadius: 10,
    elevation: 5,
    marginTop: 16
  },
  sectionHeader: {
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 16 * 1.3,
    // padding: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    // backgroundColor: '#f0f0f0',
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

});

export default ShiftCard;