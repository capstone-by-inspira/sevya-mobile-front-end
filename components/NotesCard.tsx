import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface NoteCardProps {
  caregiverName: string;
  caregiverImage: string;
  time: string;
  note: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ caregiverName, caregiverImage, time, note }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedNote, setTranslatedNote] = useState<string>("");

  const translateNote = async () => {
    // Mock translation - Replace with actual API call
    setTranslatedNote(`Translated: ${note}`); // Simulated translation
    setShowTranslation(true);
  };

  return (
    <View style={styles.card}>
      {/* Caregiver Info */}
      <View style={styles.header}>
        <Image source={{ uri: caregiverImage }} style={styles.avatar} />
        <Text style={styles.name}>By {caregiverName}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      {/* Note Content */}
      <View style={styles.content}>
        <Text style={styles.noteText}>"{note}"</Text>

        {/* Translated Note */}
        {showTranslation && <Text style={styles.translatedText}>{translatedNote}</Text>}

        {/* Translate Button */}
        {!showTranslation && (
          <TouchableOpacity onPress={translateNote}>
            <Text style={styles.translateText}>See translation</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
    flex: 1,
  },
  time: {
    color: "gray",
  },
  content: {
    marginTop: 5,
  },
  noteText: {
    fontSize: 14,
    marginBottom: 5,
  },
  translatedText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "gray",
    marginTop: 5,
  },
  translateText: {
    color: "#007bff",
    marginTop: 8,
  },
});

export default NoteCard;
