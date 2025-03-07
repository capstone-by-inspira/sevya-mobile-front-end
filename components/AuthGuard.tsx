// context/AppContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getSecureData } from '../services/secureStorage'; // Import secure storage
import { View, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { getDocuments, getDocumentById, getDocumentByKeyValue } from '@/services/api';

// Define your data types
interface AppContextType {
  isAuth: boolean;
  caregivers: any; // Change to 'any'
  patients: any;   // Change to 'any'
  shifts: any;     // Change to 'any'
  fetchData: () => void;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}


// Create the context with a default value of 
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [token, setToken] = useState<any>();
  const [userData, setUserData] = useState<any>(null); // State to store user data

  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [caregivers, setCaregivers] = useState<any>([]); // Change to 'any'
  const [patients, setPatients] = useState<any>([]);     // Change to 'any'
  const [shifts, setShifts] = useState<any>([]);         // Change to 'any'

  // Fetch data (caregivers, patients, and shifts)
  useEffect(() => {
    const fetchUser = async () => {
      const token = await getSecureData("token");
      if(token){
        setToken(token);
      }
      const userString = await getSecureData("user");
      if (userString) {
        const user = JSON.parse(userString); // Parse the JSON string
        console.log('user>>>>>', user);
        setUserData(user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
     
    }else{
      console.log('tttttttt');
    }
  }, [token, userData]);

  const fetchData = async () => {
    fetchPatients();
    fetchCaregiver();
    fetchShifts();
  }
  const fetchCaregiver = async () => {

    const result = await getDocumentById("caregivers", userData.uid, token);
    if (result.success) {
      console.log('caregiver>>>>>>>>>>.', result.data);
      setCaregivers(result.data);
    } else {
      console.error(result.error);
    }
  };

  const fetchPatients = async () => {
    const result = await getDocuments("patients", token);
    // const result = await getDocumentByKeyValue("patients", 'caregiverAssigned',userData.uid, token);
    if (result.success) {
      // console.log('patients>>>>>>>>>>.', result.data);
      const patientsWithCaregiver = getPatientsForCaregiver(result.data, userData.uid);

      console.log(patientsWithCaregiver, 'patient >>>>>>>>>>');
      setPatients(patientsWithCaregiver);
    } else {
      console.error(result.error);
    }
  };

  const getPatientsForCaregiver = (patients: any[], caregiverID: string): any[] => {
    // Find all patients whose shifts contain the caregiver's ID
    const patientsForCaregiver = patients.filter((patient) => {
      return Object.values(patient.shifts).some((shift:any) => shift.id === caregiverID);
    });
  
    return patientsForCaregiver;
  };

  const fetchShifts = async () => {
    const result = await getDocumentByKeyValue("shifts", "caregiverId", userData.uid, token);
    if (result.success) {
      console.log('shifts>>>>>>>>>>.', result.data);
      setShifts(result.data);
    } else {
      console.error(result.error);
    }
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getSecureData('token'); // Get token securely
      setToken(token);
      setIsAuth(!!token);
    };
    checkAuth();
  }, []); // Check auth status when the app loads

  return (
    <AppContext.Provider value={{ isAuth, caregivers, patients, shifts, fetchData, setIsAuth }}>
      {children}
    </AppContext.Provider>
  );
};

// AuthGuard Component
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { isAuth } = context;

  if (isAuth === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuth ? <>{children}</> : <Redirect href="/login" />;
};

export { AppContext, AppProvider, AuthGuard };
