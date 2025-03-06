import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { getDocuments } from '@/services/api'
import { getSecureData } from "@/services/secureStorage";
import Button from '@/components/ui/Button'

interface Shift {
  id: number
  caregiver_id: number
  caregiver_name: string
  patient_id: number
  start_time: string
  end_time: string
  admin_id: number
  status: string
}

interface ShiftCardProps {
  shift: Shift
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {

  const handleStartShift = async () => {
    console.log("Start Shift")
  }
  
  const handleAPICall = async () => {
    try {
      const token = await getSecureData("token");
      if (!token) {
        Alert.alert("Error", "No authentication token found. Please log in.");
        return;
      }
      const result = await getDocuments("shifts", token);
      if (result.success) {
        console.log("Shifts Data:", result.data);
        Alert.alert("Success", "Shifts retrieved successfully!");
      } else {
        console.error("API Error:", result.error);
        Alert.alert("API Error", result.error);
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.error || "Something went wrong.");
    }
  }
  
  return (
    <View>
      <Text>Shifts</Text>

      <TouchableOpacity style={styles.button}
        onPress={() => router.push(`/shift/${shift.id}`)}>
        <Text style={styles.buttonText}>Today's Shift Details</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAPICall} style={styles.button}>
        <Text style={styles.buttonText}>Get All Shifts</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E5989B',
    paddingVertical: 20,
    margin: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default ShiftCard