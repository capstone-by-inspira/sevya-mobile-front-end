import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getSecureData } from "../services/secureStorage";
import { View, ActivityIndicator } from "react-native";
import { getDocuments, getDocumentById, getDocumentByKeyValue } from "@/services/api";
import { WS_URL } from "@/services/api";
interface AppContextType {
  isAuth: boolean;
  caregivers: any;
  patients: any;
  shifts: any;
  fetchData: () => void;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  token: any;
  messages: any[];
  ws: WebSocket | null;
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
  const [messages, setMessages] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isAuth) {
      const websocket = new WebSocket(WS_URL);

      websocket.onopen = () => {
        console.log("WebSocket connected mobile");
      };

      websocket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);

        if (message.event === "data_updated") {
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

        setMessages((prevMessages) => [...prevMessages, message]);
      };

      websocket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setWs(websocket);

      return () => {
        websocket.close();
      };
    }
  }, [isAuth]);

  useEffect(() => {
    const fetchUserAndData = async () => {
      setLoading(true);
      try {
        const token = await getSecureData("token");
        const userString = await getSecureData("user");

        if (token) {
          setToken(token);
          setIsAuth(true);

          if (userString) {
            const user = JSON.parse(userString);
            setUserData(user);
            await fetchData();
          }
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, []);

  useEffect(() => {
    if (isAuth && userData) {
      fetchData();
    }
  }, [isAuth, userData]);

  const fetchData = async () => {
    await fetchCaregiver();
    await fetchPatients();
    await fetchShifts();
  };

  const fetchCaregiver = async () => {
    if (!userData || !userData.uid) return; // Ensure userData is available
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
    if (!token) return; // Ensure token is available
    try {
      const result = await getDocuments("patients", token);
      if (result.success && userData?.uid) {
        const patientsWithCaregiver = getPatientsForCaregiver(result.data, userData.uid);
        setPatients(patientsWithCaregiver);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const getPatientsForCaregiver = (patients: any[], caregiverID: string): any[] => {
    return patients.filter((patient) =>
      Object.values(patient.shifts).some((shift: any) => shift.id === caregiverID)
    );
  };

  const fetchShifts = async () => {
    if (!userData || !userData.uid) return; // Ensure userData is available
    try {
      const result = await getDocumentByKeyValue("shifts", "caregiverId", userData.uid, token);
      if (result.success) {
        setShifts(result.data);
      } else {
        setShifts([]);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setShifts([]);
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
        messages,
        ws,
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
