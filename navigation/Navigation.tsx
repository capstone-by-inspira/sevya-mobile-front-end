import React from "react";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Patients from "../app/(tabs)/patients"; // List of patients
import PatientDetails from "../app/patients/[id]"; // Patient details screen
import CarePlan from '../app/patients/CarePlan'; // Adjust if necessary
import Notes from '../app/patients/Notes'; // Ensure this is correct

// Define Stack Param List
export type RootStackParamList = {
  Patients: undefined;
  PatientDetails: { id: string };
  CarePlan: undefined;
  Notes: undefined;
};

// Correctly export the navigation prop type
export type NavigationProp = StackNavigationProp<RootStackParamList>;

// Attach StackNavigator to RootStackParamList
const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Patients">
        <Stack.Screen name="Patients" component={Patients} />
        <Stack.Screen name="PatientDetails" component={PatientDetails} />
        <Stack.Screen name="CarePlan" component={CarePlan} />
        <Stack.Screen name="Notes" component={Notes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
