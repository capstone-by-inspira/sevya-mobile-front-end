import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import React, { useContext } from 'react';
import { AppContext } from "@/components/AppContext";
import { Ionicons } from "@expo/vector-icons";

const Notifications = () => {
    const context = useContext(AppContext);
    // const [notifications, setNotifications] = React.useState();

    const notifications = [
        {
          id: "1",
          title: "New Follower",
          message: "@john_doe started following you.",
        },
        {
          id: "2",
          title: "Mention",
          message: "@alice mentioned you in a tweet!",
        },
        {
          id: "3",
          title: "Like",
          message: "@michael liked your tweet.",
        },
      ];

    if (!context) {
        return <Text>Error: AppContext n found</Text>;
    }

    return (
        <View style={[styles.container, {backgroundColor: "#fff"}]}> 
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Image source={require("@/assets/Sevya-logo.png")} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: "#000" }]}>
                  {item.title}
                </Text>
                <Text style={[styles.message, { color: "#555" }]}>
                  {item.message}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    )
}

export default Notifications

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
    },
    notificationItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 15,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    message: {
      fontSize: 14,
      marginTop: 3,
    },
  });