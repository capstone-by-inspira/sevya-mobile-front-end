import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getSecureData } from '../services/secureStorage';
import { View, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useRouter } from 'expo-router';
import { getDocuments, getDocumentById, getDocumentByKeyValue } from '@/services/api';

interface AppContextType {
  isAuth: boolean;
  caregivers: any;
  patients: any;
  shifts: any;
  fetchData: () => void;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  token: any;
  messages: any[]; // Add WebSocket messages to the context
  ws: WebSocket | null; // Add WebSocket connection to the context
}

const AppContext = createContext<AppContextType | undefined>(undefined); // CREATING CONTEXT

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
  const [messages, setMessages] = useState<any[]>([]); // State for WebSocket messages
  const [ws, setWs] = useState<WebSocket | null>(null); // State for WebSocket connection

  // Initialize WebSocket connection
  useEffect(() => {
    if (isAuth) {
      const websocket = new WebSocket("ws://localhost:8800");

      websocket.onopen = () => {
        console.log("WebSocket connected");
      };

      websocket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);
  
        if (message.event === "data_updated") {
          // Refetch data based on the updated collection
          switch (message.collection) {
            case "shifts":
              await fetchShifts();
              break;
            case "patients":
              await fetchPatients();
              break;
            case "caregivers":
              await fetchCaregiver();
              break;
            default:
              break;
          }
        }
  
        // Update messages state (optional, for debugging)
        setMessages((prevMessages) => [...prevMessages, message]);
      };
  
      websocket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setWs(websocket); // Store the WebSocket connection

      // Cleanup on unmount
      return () => {
        websocket.close();
      };
    }
  }, [isAuth]); // Reconnect WebSocket when authentication status changes

  useEffect(() => {
    const fetchUserAndData = async () => {
      setLoading(true); // Start loading

      try {
        // Step 1: Fetch token and user data
        const token = await getSecureData("token");
        const userString = await getSecureData("user");

        if (token) {
          setToken(token);
          setIsAuth(true);

          if (userString) {
            const user = JSON.parse(userString);
            setUserData(user);

            // Step 2: Fetch additional data (patients, caregivers, shifts)
            const [patientsResponse, caregiversResponse, shiftsResponse] = await Promise.all([
              getDocuments("patients", token),
              getDocumentById("caregivers", user.uid, token),
              getDocumentByKeyValue("shifts", "caregiverId", user.uid, token),
            ]);

            // Filter patients for the current caregiver
            const patientsWithCaregiver = patientsResponse.data.filter((patient: any) =>
              Object.values(patient.shifts).some((shift: any) => shift.id === user.uid)
            );

            // Update state with fetched data
            setPatients(patientsWithCaregiver);
            setCaregivers(caregiversResponse.data);
            setShifts(shiftsResponse.data);
          }
        } else {
          setIsAuth(false); // No token found
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsAuth(false); // Authentication failed
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserAndData(); // Call the combined function
  }, []);

  const fetchData = async () => {
    await fetchCaregiver();
    await fetchPatients();
    await fetchShifts();
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
      }else{
        setShifts([]);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuth,
        caregivers,
        patients,
        shifts,
        fetchData,
        setIsAuth,
        loading,
        token,
        messages, // Provide WebSocket messages to consumers
        ws, // Provide WebSocket connection to consumers
      }}
    >
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };