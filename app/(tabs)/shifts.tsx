import { 
  Alert, StyleSheet, Text, TouchableOpacity, View, Modal, FlatList, RefreshControl, ScrollView 
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import ShiftDetailCard from '@/components/ShiftDetailCard';
import { AppContext } from '@/components/AuthGuard';

const ShiftCard: React.FC = () => {
  const context = useContext(AppContext);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [allShifts, setAllShifts] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [upComingShifts, setUpComingShifts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false); // Refresh state

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { shifts, fetchData } = context;

  useEffect(() => {
    markShiftsOnCalendar();
  }, [shifts]);

  const markShiftsOnCalendar = () => {
    const marks = shifts.reduce((acc: any, shift: any) => {
      const date = shift.startTime.split("T")[0]; // Extract YYYY-MM-DD
      acc[date] = { selected: true, selectedColor: "#25578E" };
      return acc;
    }, {});
    
    setMarkedDates(marks);
    setAllShifts(shifts);

    // Filter upcoming shifts
    const today = new Date().toISOString().split("T")[0];
    const upcomingShiftData = shifts.filter((shift: any) => shift.startTime >= today);
    setUpComingShifts(upcomingShiftData);
  };

  // Pull-to-refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Re-fetch all data (calendar + shifts)
    setRefreshing(false);
  };

  const handleDayPress = (day: any) => {
    const date = day.dateString;
    setSelectedDate(date);
    const filteredShifts = allShifts.filter(shift => shift.startTime.startsWith(date));
    
    if (filteredShifts.length > 0) {
      setModalVisible(true);
    } else {
      Alert.alert("No Shifts", "No shifts found for this date.");
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.container}>
        <Text>Shifts Calendar</Text>
        <Calendar style={styles.calendar} onDayPress={handleDayPress} markedDates={markedDates} />

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Shifts on {selectedDate}</Text>
              <FlatList
                data={allShifts.filter(shift => shift.startTime.startsWith(selectedDate!))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ShiftDetailCard location={item.location} shiftTime={item.startTime} />
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Upcoming Shifts List */}
      <View style={styles.upComingShiftsContainer}>
        <Text>Upcoming Shifts</Text>
        {upComingShifts.length > 0 ? (
          <FlatList
            data={upComingShifts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ShiftDetailCard location={item.location} shiftTime={item.startTime} />
            )}
          />
        ) : (
          <Text style={styles.noShiftsText}>No upcoming shifts</Text>
        )}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollView: { 
    flex: 1
  },
  container: {
    padding: 20,
    width: '100%',
  },
  calendar: {
    marginVertical: 20,
    width: '100%',
    height: 370,
    borderRadius: 10,
    borderColor: 'red',
    elevation: 5,
  },
  detailsContainer: {
    padding: 20,
    width: '100%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  shiftCard: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: "#25578E",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
  noShiftsText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  upComingShiftsContainer: {
    paddingHorizontal: 20,

  },
})

export default ShiftCard