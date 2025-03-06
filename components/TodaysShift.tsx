import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Divider, Icon } from 'react-native-paper';
import Button from '@/components/ui/Button';
import { router } from 'expo-router';
import { getDocumentById, getDocumentByKeyValue } from '@/services/api';
import { getSecureData } from "@/services/secureStorage";
import { formatDateOnly, formatTimeOnly } from '@/services/utils';

interface Shift {
    id: number;
    caregiverId: number;
    patientId: number;
    startTime: string;
    endTime: string;
    adminId: number;
    status: string;
}

const TodaysShift = () => {
    const [name, setName] = useState("User");
    const [location, setLocation] = useState("");
    const [shiftTime, setShiftTime] = useState("");
    const [shifts, setShifts] = useState([]);
    const [shift, setShift] = useState<Shift | null>(null);
    const [caregiver, setCaregiver] = useState();
    const [noShift, setNoShift] = useState(false); // Tracks no shift today

    useEffect(() => {
        getCaregiverShiftData();
        getCaregiverData();
    }, []);

    const getCurrentDateDDMMYYYY = (): string => {
        return new Date().toLocaleDateString('en-GB');
    };

    const getTodaysShiftData = async (shifts: any[]) => {
        const today = new Date();
        const localDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

        console.log('result.data::', localDate)
        const todaysShifts = shifts.filter(shift => shift.startTime.startsWith(localDate));
        console.log('result.data::', todaysShifts)
        if (todaysShifts.length === 0) {
            setNoShift(true);
            return null;
        }

        setNoShift(false);
        return todaysShifts.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
    };

    const getCaregiverShiftData = async () => {
        try {
            const token = await getSecureData("token");
            const caregiverId = 'glX3yKP5j7fW70OZ1tWHlhuyhcf2';
            if (!token) {
                Alert.alert("Error", "No authentication token found. Please log in.");
                return;
            }

            const result = await getDocumentByKeyValue("shifts", "caregiverId", caregiverId, token);

            if (result.success) {
                
                setShifts(result.data);
                const earliestShift = await getTodaysShiftData(result.data);

                if (earliestShift) {
                    console.log('result.data::', earliestShift)
                    setShift(earliestShift);
                    setLocation(earliestShift.location || "No location provided");
                    setShiftTime(earliestShift.startTime || "No time provided");
                }
            } else {
                setNoShift(true);
                console.error("API Error:", result.error);
                Alert.alert("API Error", result.error);
            }
        } catch (error: any) {
            setNoShift(true);
            console.error("API Error:", error.message);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    const getCaregiverData = async () => {
        try {
            const token = await getSecureData("token");
            const caregiverId = 'oP0l5aPKimWP2im6fPQFa68wmb83';
            if (!token) {
                Alert.alert("Error", "No authentication token found. Please log in.");
                return;
            }

            const result = await getDocumentById("caregivers", caregiverId, token);

            if (result.success) {
                setCaregiver(result.data);
                setName(result.data.firstName);
            } else {
                console.error("API Error:", result.error);
                Alert.alert("API Error", result.error);
            }
        } catch (error: any) {
            console.error("API Error:", error.message);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Hi, <Text style={styles.boldText}>{name}</Text></Text>

            {noShift ? (
                <Text style={styles.noShiftText}>No shift for today</Text>
            ) : (
                <>
                    {shift && shift.id ? (
                        <Button 
                            handleButtonClick={() => router.push(`/shift/${shift.id}`)} 
                            buttonText="Ready for your shift?" 
                        />
                    ) : (
                        <Text>No shift details available</Text>
                    )}
                    <Text style={styles.shiftTitle}>
                        <Text style={styles.boldText}>Today's Shift:</Text> {getCurrentDateDDMMYYYY()}
                    </Text>

                    <Card style={styles.card}>
                        <View style={styles.cardContent}>
                            <View style={styles.row}>
                                <Icon source="map-marker-outline" size={20} color="#2C3E50" />
                                <Text style={styles.cardText}>{location}</Text>
                            </View>
                            <View style={styles.row}>
                                <Icon source="information-outline" size={20} color="#2C3E50" />
                                <Text style={styles.cardText}>{formatDateOnly(shiftTime)} {formatTimeOnly(shiftTime)}</Text>
                            </View>
                        </View>
                        <Divider />
                        <TouchableOpacity style={styles.scheduleButton} onPress={() => router.replace('/(tabs)/shifts')}>
                            <Icon source="calendar" size={18} color="#1E3A8A" />
                            <Text style={styles.scheduleText}>View Your Schedule</Text>
                        </TouchableOpacity>
                    </Card>
                </>
            )}
        </View>
    );
};

export default TodaysShift;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 20,
    },
    greeting: {
        fontSize: 20,
        color: '#000000',
        marginBottom: 10,
        marginTop: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    noShiftText: {
        fontSize: 26,
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    shiftTitle: {
        fontSize: 16,
        color: '#1E293B',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        elevation: 2,
    },
    cardContent: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 8,
    },
    scheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scheduleText: {
        color: '#1E3A8A',
        fontWeight: 'bold',
        marginVertical: 10,
    },
});
