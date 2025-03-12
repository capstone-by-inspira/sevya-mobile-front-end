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
  Image,
} from "react-native";
import { getSecureData } from "../../services/secureStorage";
import { useLocalSearchParams } from "expo-router";
import { db } from "@/FirebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const Notes = () => {
  const { id } = useLocalSearchParams();
  const [notes, setNotes] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);

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

  const addNote = async () => {
    if (!id || (!note.trim() && !imageUri)) return;

    try {
      const userData = await getSecureData("user");
      if (!userData) {
        console.error("User data not found.");
        return;
      }

      const user = JSON.parse(userData);
      if (!user?.name) {
        console.error("User name is missing.");
        return;
      }

      const newNote = {
        caregiverName: user.name,
        myNote: note || "",
        imageUrl: imageUri || null,
        date: Timestamp.now(),
      };

      const docRef = doc(db, "patients", id as string);
      await updateDoc(docRef, {
        notes: arrayUnion(newNote),
      });

      setNotes((prevNotes) => [...prevNotes, newNote]);
      setNote("");
      setImageUri(null);
      console.log("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) return;
      if (response.assets) {
        setImageUri(response.assets[0].uri ?? null);
      }
    });
  };

  const handleCameraOpen = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (response.didCancel) return;
      if (response.assets) {
        setImageUri(response.assets[0].uri ?? null);
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Patient Notes</Text>

          <ScrollView contentContainerStyle={styles.notesContainer}>
            {loading ? (
              <Text>Loading...</Text>
            ) : notes.length > 0 ? (
              notes.map((item, index) => (
                <View key={index} style={styles.noteBubble}>
                  <Text style={styles.noteAuthor}>{item.caregiverName}</Text>
                  <Text style={styles.noteText}>{item.myNote}</Text>
                  {item.imageUrl && (
                    <Image source={{ uri: item.imageUrl }} style={styles.noteImage} />
                  )}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={note}
          onChangeText={setNote}
          placeholder="Type your note here..."
          multiline
        />
        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={handleCameraOpen}>
          <Text style={styles.iconText}>📸</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={addNote}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
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
    paddingBottom: 100,
  },
  noteBubble: {
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  noteAuthor: {
    fontWeight: "bold",
    color: "#075E54",
  },
  noteText: {
    fontSize: 16,
    marginVertical: 5,
  },
  noteImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginTop: 5,
  },
  noteDate: {
    fontSize: 12,
    color: "gray",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
  },
  imageButton: {
    marginLeft: 10,
    padding: 8,
  },
  iconText: {
    fontSize: 22,
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
  previewImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 8,
  },
});

export default Notes;
