import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Card, Icon } from 'react-native-paper'
import { formatDateOnly, formatTimeOnly } from '@/services/utils';

interface ShiftDetailCardProps {
    location: string;
    shiftTime: string;
}

const ShiftDetailCard: React.FC<ShiftDetailCardProps> = ({ location, shiftTime }) => {
    return (
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
        </Card>
    )
}

export default ShiftDetailCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        elevation: 2,
    },
    cardContent: {
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
})