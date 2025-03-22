import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Card, Icon, MD3Colors } from 'react-native-paper'
import { formatDateAndMonthOnly, formatDateOnly, formatTimeOnly, formatShiftTimeOnly } from '@/services/utils';
import Button from './ui/Button';
import { router } from 'expo-router';

interface TodayShiftDetailCardProps {
    location: string;
    shiftTime: string;
    shiftEndTime: string;
    shiftId: string;
    shifts: any,
    patients: any
}

const TodayShiftDetailCard: React.FC<TodayShiftDetailCardProps> = ({ location, shiftTime, shiftEndTime, shiftId, shifts, patients }) => {
    const handleViewMore = () => {
        // router.push(`/shiftTest/${shiftId}`);
        router.push({
            pathname: `/shiftTest/[id]`,
            params: {
                id: shiftId,  
                shiftData: JSON.stringify(shifts),
                patientData: JSON.stringify(patients),  
            }
        })
    }
    return (
        <Card style={styles.card}>
            <View>
                <View style={styles.row}>
                    {/* <Icon source="map-marker-outline" size={20} color={MD3Colors.primary40} /> */}
                    <Icon source="map-marker-outline" size={20} color="#2C3E50" />
                    <Text style={styles.cardText}>{location}</Text>
                </View>
                <View style={styles.row}>
                    <Icon source="clock-outline" size={20} color="#2C3E50" />
                    <Text style={styles.cardText}>{formatDateAndMonthOnly(shiftTime)},  {formatShiftTimeOnly(shiftTime)} - {formatShiftTimeOnly(shiftEndTime)}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        handleButtonClick={handleViewMore}
                        buttonText="View More"
                        disabled={false} />
                </View>
                
            </View>
        </Card>
    )
}

export default TodayShiftDetailCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 16,
        marginHorizontal: 16,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 8,
    },
    cardText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})