import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react';
import { AppContext } from "@/components/AppContext";

const Notifications = () => {
    const context = useContext(AppContext);
    const [notifications, setNotifications] = React.useState();

    if (!context) {
        return <Text>Error: AppContext n found</Text>;
    }

    const { caregivers, messages } = context;
    console.log('messages', messages);



    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                Notifications
            </Text>

            {/* Static Notifications */}
            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>🔔 Event Reminder</Text>
                <Text>Your event is scheduled for tomorrow at 5 PM.</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>📢 New Update</Text>
                <Text>The app has been updated with new features!</Text>
            </View>

            <View>
                <Text style={{ fontWeight: "bold" }}>🎉 Special Offer</Text>
                <Text>Get 20% off on your next booking!</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>🔔 Event Reminder</Text>
                <Text>Your event is scheduled for tomorrow at 5 PM.</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>📢 New Update</Text>
                <Text>The app has been updated with new features!</Text>
            </View>

            <View>
                <Text style={{ fontWeight: "bold" }}>🎉 Special Offer</Text>
                <Text>Get 20% off on your next booking!</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>🔔 Event Reminder</Text>
                <Text>Your event is scheduled for tomorrow at 5 PM.</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>📢 New Update</Text>
                <Text>The app has been updated with new features!</Text>
            </View>

            <View>
                <Text style={{ fontWeight: "bold" }}>🎉 Special Offer</Text>
                <Text>Get 20% off on your next booking!</Text>
            </View>
        </View>
    )
}

export default Notifications

const styles = StyleSheet.create({})