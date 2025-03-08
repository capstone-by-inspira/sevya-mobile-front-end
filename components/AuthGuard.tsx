import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getSecureData } from '../services/secureStorage';
import { View, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { getDocuments, getDocumentById, getDocumentByKeyValue } from '@/services/api';

interface AppContextType {
  isAuth: boolean;
  caregivers: any;
  patients: any;
  shifts: any;
  fetchData: () => void;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  token:any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [token, setToken] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [caregivers, setCaregivers] = useState<any>([]);
  const [patients, setPatients] = useState<any>([]);
  const [shifts, setShifts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getSecureData("token");
        if (token) {
          setToken(token);
          setIsAuth(true);
        } else {
            setIsAuth(false);
        }
        const userString = await getSecureData("user");
        if (userString) {
          setUserData(JSON.parse(userString));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (token && userData) {
        setLoading(true);
        try {
          await Promise.all([fetchPatients(), fetchCaregiver(), fetchShifts()]);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [token, userData]);

  const fetchData = () => {
    fetchCaregiver();
    fetchPatients();
    fetchShifts();
  };

  const fetchCaregiver = async () => {
    try {
      const result = await getDocumentById("caregivers", userData.uid, token);
      if (result.success) {
        setCaregivers(result.data);
      }
    } catch (error) {
      console.error("Error fetching caregivers:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const result = await getDocuments("patients", token);
      if (result.success) {
        const patientsWithCaregiver = getPatientsForCaregiver(result.data, userData.uid);
        setPatients(patientsWithCaregiver);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const getPatientsForCaregiver = (patients: any[], caregiverID: string): any[] => {
    return patients.filter((patient) => {
      return Object.values(patient.shifts).some((shift: any) => shift.id === caregiverID);
    });
  };

  const fetchShifts = async () => {
    try {
      const result = await getDocumentByKeyValue("shifts", "caregiverId", userData.uid, token);
      if (result.success) {
        setShifts(result.data);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  return (
    <AppContext.Provider value={{ isAuth, caregivers, patients, shifts, fetchData, setIsAuth, loading, token }}>
      {children}
    </AppContext.Provider>
  );
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(AppContext);
  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }
  const { isAuth, loading } = context;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuth ? <>{children}</> : <Redirect href="/login" />;
};

export { AppContext, AppProvider, AuthGuard };