import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

// Define the type for WebSocket messages
interface WebSocketMessage {
  event: string;
  data: any; // Use a more specific type if you know the structure of `data`
}

const WebSocketClient: React.FC = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    // Connect to the WebSocket server
    const ws = new WebSocket("http://192.168.1.212:8800");

    // Handle WebSocket connection open
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    // Handle incoming WebSocket messages
    ws.onmessage = (event: WebSocketMessageEvent) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log("Received message:", message);

      // Update the state with the new message
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Handle WebSocket connection close
    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    // Handle WebSocket errors
    ws.onerror = (event: Event) => {
      console.error("WebSocket error:", event);
    };

    // Clean up the WebSocket connection
    return () => {
      ws.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebSocket Messages</Text>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageItem}>
            <Text style={styles.eventText}>
              <Text style={styles.boldText}>{msg.event}</Text>: {JSON.stringify(msg.data)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  messageItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  eventText: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default WebSocketClient;