import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
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
<<<<<<< HEAD
import { useLocalSearchParams } from "expo-router";
import { db } from "@/FirebaseConfig";
=======
import { useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "@/FirebaseConfig"; // Ensure correct Firebase path
>>>>>>> main
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

<<<<<<< HEAD
=======
  const navigation = useNavigation();
  // Fetch notes from Firebase
>>>>>>> main
  useEffect(() => {
    const fetchNotes = async () => {
      if (!id) return;

      try {
        const myid = "P0YUuUGAY4LQzOiSs4OS";
        const docRef = doc(db, "patients", myid as string);
        // const docRef = doc(db, "patients", id as string);
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

<<<<<<< HEAD
=======
  useEffect(() => {
    if (id) {
      navigation.setOptions({ title: `Notes` }); // Set the header title
   }
  }, [id, navigation]);
  // Add a new note to Firebase
>>>>>>> main
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

  const handleImagePick = async () => {
    console.log("Gallery button clicked!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // ✅ Use an array instead of MediaTypeOptions.Photo
      allowsEditing: true,
      quality: 1,
    });

    console.log("Gallery Response:", result);

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCameraOpen = async () => {
    console.log("Camera button clicked!");

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"], // ✅ Updated usage
      allowsEditing: true,
      quality: 1,
    });

    console.log("Camera Response:", result);

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Patient Notes</Text>
<<<<<<< HEAD
          <ScrollView contentContainerStyle={styles.notesContainer}>
=======

          <ScrollView
            contentContainerStyle={styles.notesContainer}
            keyboardShouldPersistTaps="handled" // Ensure taps outside input dismiss keyboard
          >
>>>>>>> main
            {loading ? (
              <Text>Loading...</Text>
            ) : notes.length > 0 ? (
              notes.map((item, index) => (
                <View key={index} style={styles.noteBubble}>
                  <Text style={styles.noteAuthor}>{item.caregiverName}</Text>
                  <Text style={styles.noteText}>{item.myNote}</Text>
                  {item.imageUrl && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.noteImage}
                    />
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
        {imageUri && (
          <View style={styles.imagePreviewWrapper}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImageUri(null)}
            >
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>
          </View>
        )}

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
<<<<<<< HEAD
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
=======
    paddingTop: 20,
    paddingBottom: 50,
    marginBottom:80,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
>>>>>>> main
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  textInput: {
    backgroundColor:'white',
    display:"flex",
    justifyContent:'center',
    alignItems:'center',
  
    flex: 1,
    padding:10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 16,
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
  imagePreviewContainer: {
    position: "absolute",
    top: 10, // Adjust the positioning
    left: 10, // Puts it in the top-left corner
    width: 70, // Keeps it small
    height: 70,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  imagePreviewWrapper: {
    alignSelf: "flex-start",
    marginBottom: 5, // Adds spacing between image and input field
    marginLeft: 10,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 5, // Space between image and TextInput
  },
  
  closeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Notes;
