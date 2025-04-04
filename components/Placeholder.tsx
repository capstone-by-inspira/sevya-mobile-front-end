import { useReducer } from "react";
import { StyleSheet, FlatList, Pressable, View } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { Card, Divider, Icon } from "react-native-paper";
import { Alert, Text, TouchableOpacity } from "react-native";

const renderPatientCardPlaceholder = () => (
  <MotiView
    transition={{
      type: "timing",
    }}
    style={[styles.card, styles.padded]}
  >
    <Skeleton colorMode={"light"} radius="round" height={60} width={60} />
    <Spacer />
    <Skeleton colorMode={"light"} width={"100%"} />
    <Spacer height={8} />
    <Skeleton colorMode={"light"} width={"100%"} />
  </MotiView>
);
const patients = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    medicalConditions: ["Condition A"],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    gender: "Female",
    medicalConditions: ["Condition B"],
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    gender: "Female",
    medicalConditions: ["Condition C"],
  },
];
export default function HelloWorld() {
  return (
    <View>
      <MotiView
        transition={{
          type: "timing",
        }}
        style={[styles.todayShiftContainer, styles.padded]}
      >
        <Spacer />
        <Skeleton colorMode={"light"} width={"80%"} />
        <Spacer height={30} />
        <Skeleton colorMode={"light"} width={"30%"} />
      </MotiView>

      <Divider />

      <View style={todayShiftStyles.container}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Skeleton colorMode={"light"} width={"60%"} />
        </View>

        <Card style={todayShiftStyles.card}>
          <View style={todayShiftStyles.cardContent}>
            <View style={todayShiftStyles.row}>
              <Icon source="map-marker-outline" size={20} color="#2C3E50" />
              <Skeleton colorMode={"light"} width={"70%"} />
            </View>
            <View style={todayShiftStyles.row}>
              <Icon source="information-outline" size={20} color="#2C3E50" />
              <Skeleton colorMode={"light"} width={"70%"} />
            </View>
          </View>
          <Divider />
          <TouchableOpacity
            style={todayShiftStyles.scheduleButton}
            // onPress={() => router.replace("/(tabs)/shifts")}
          >
            <Icon source="calendar" size={18} color="#1E3A8A" />
            <Text style={todayShiftStyles.scheduleText}>View Your Shift</Text>
          </TouchableOpacity>
        </Card>
      </View>

      <Divider />

      <View style={styles.patientCardContainer}>
        <View style={styles.title}>
          <Text>Patients Under Care</Text>
        </View>

        <FlatList
          data={patients} // Use the demo data
          renderItem={renderPatientCardPlaceholder}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
     
    </View>
  );
}

const Spacer = ({ height = 40 }) => <View style={{ height }} />;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "#1E293B",
    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  patientCardContainer: {
    paddingTop: 20,
  },
  todayShiftContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
    paddingTop:0,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginLeft: 25,
    marginRight: 0,
    marginBottom:20,
    alignItems: "center",
    width: 180,
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  padded: {
    padding: 16,
  },
});

const todayShiftStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 30,
  },
  greeting: {},
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
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingTop: 14,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 6,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.14)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.14,
  },
  cardContent: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 3,
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
