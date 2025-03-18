import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { getSecureData } from "../../services/secureStorage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "@/FirebaseConfig"; // Ensure correct Firebase path
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { SelectList } from 'react-native-dropdown-select-list';
import { translatePatientNotes } from "@/services/api";
import NoteCard from "@/components/NotesCard";

const Notes = () => {
  const { id } = useLocalSearchParams(); // Get patient ID
  const [notes, setNotes] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [translatedNotes, setTranslatedNotes] = useState<{ [key: number]: string }>({});
  const languages = [
    { key: "en", value: "English" },
    { key: "pa", value: "Punjabi" },
    { key: "hi", value: "Hindi" },
    { key: "fr", value: "French" },
    { key: "ja", value: "Japanese" },
    { key: "tl", value: "Filipino" },
    { key: "zh", value: "Chinese" },
    { key: "es", value: "Spanish" },
  ];

  const navigation = useNavigation();
  // Fetch notes from Firebase
  useEffect(() => {
    const fetchNotes = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "patients", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNotes(docSnap.data().notes || []);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [id]);

  const translateNote = async (text: string, index: number) => {
    try {
      const targetLang =
        languages.find((lang) => lang.value === selectedLanguage)?.key || "en";

      const patientData = {
        notes: text,
        language: targetLang,
      };

      console.log("patientData", patientData);

      const response = await translatePatientNotes(patientData);
      console.log("translated", response);
      const translatedText = response.translatedText.data.translations[0].translatedText;
      console.log("result", translatedText);
      setTranslatedNotes((prev) => ({
        ...prev,
        [index]: translatedText,
      }));
    } catch (error: any) {
      console.error("Translation failed:", error.message);
    }
  };

  useEffect(() => {
    if (id) {
      navigation.setOptions({ title: `Notes` }); // Set the header title
    }
  }, [id, navigation]);
  // Add a new note to Firebase
  const addNote = async () => {
    if (!id || !note.trim()) return;

    try {
      // Retrieve caregiver's name from user data
      const userData = await getSecureData("user");

      if (!userData) {
        console.error("User data not found.");
        return;
      }

      const user = JSON.parse(userData); // Parse JSON only if userData exists

      if (!user?.name) {
        console.error("User name is missing.");
        return;
      }

      const newNote = {
        caregiverName: user.name, // Use the actual caregiver name from user data
        myNote: note,
        date: Timestamp.now(),
      };

      // Firestore update: Push the new note to the patient's document
      const docRef = doc(db, "patients", id as string);
      await updateDoc(docRef, {
        notes: arrayUnion(newNote),
      });

      // Update local state and clear input field
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setNote(""); // Clear input
      console.log("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Patient Notes</Text>
            <SelectList
              setSelected={(val) => setSelectedLanguage(val)}
              data={languages}
              save="value"
              defaultOption={{ key: "en", value: "English" }} // Default selection
              boxStyles={styles.dropdown}
              dropdownStyles={styles.dropdownList}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.notesContainer}
            keyboardShouldPersistTaps="handled" // Ensure taps outside input dismiss keyboard
          >
            {loading ? (
              <Text>Loading...</Text>
            ) : notes.length > 0 ? (
              notes.map((item, index) => (
                <View key={index} style={styles.noteBubble}>
                  <Text style={styles.noteAuthor}>{item.caregiverName}</Text>
                  <Text style={styles.noteText}>{item.myNote}</Text>

                  {/* Show translated text if available */}
                  {translatedNotes[index] && (
                    <Text style={[styles.noteText, { fontStyle: "italic", color: "gray" }]}>
                      {translatedNotes[index]}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={() => translateNote(item.myNote, index)}
                    style={styles.translateButton}
                  >
                    <Text style={styles.translateText}>Translate</Text>
                  </TouchableOpacity>

                  <Text style={styles.noteDate}>
                    {new Date(item.date.seconds * 1000).toLocaleString()}
                  </Text>
                </View>
              ))

            ) : (
              <Text>No notes available.</Text>
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={note}
          onChangeText={setNote}
          placeholder="Type your note here..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={addNote}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  notesContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Avoid input overlap
    width: '100%'
  },
  noteBubble: {
    backgroundColor: "#DCF8C6", // WhatsApp-style bubble
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  noteAuthor: {
    fontWeight: "bold",
    color: "#075E54",
  },
  noteText: {
    fontSize: 16,
    marginVertical: 5,
  },
  noteDate: {
    fontSize: 12,
    color: "gray",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 50,
    marginBottom: 80,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  textInput: {
    backgroundColor: 'white',
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',

    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#0078D4",
    borderRadius: 20,
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  translateButton: {
    backgroundColor: "#0078D4",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  translateText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Notes;
