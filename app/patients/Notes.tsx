import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
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
  Modal,
  Alert,
} from "react-native";
import { getSecureData } from "../../services/secureStorage";
import { useLocalSearchParams } from "expo-router";
import { db } from "../../FirebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { useNavigation } from "expo-router";
import axios from "axios";

const Notes = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [notes, setNotes] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");

  // Request permission for accessing image library and camera
  useEffect(() => {
    navigation.setOptions({ title: "My Notes" });
    const requestPermissions = async () => {
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (libraryStatus !== "granted" || cameraStatus !== "granted") {
        alert("Permissions to access media library and camera are required!");
      }
    };

    requestPermissions();
  }, [navigation]);

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
    if (!id || (!note.trim() && !imageUri && !voiceMessage)) return;

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

      let uploadedImageUrl = null;
      if (imageUri) {
        uploadedImageUrl = await uploadImage(imageUri);
      }

      const newNote = {
        caregiverName: user.name,
        myNote: note || voiceMessage || "",
        imageUrl: uploadedImageUrl || null,
        date: Timestamp.now(),
      };

      const docRef = doc(db, "patients", id as string);
      await updateDoc(docRef, {
        notes: arrayUnion(newNote),
      });

      setNotes((prevNotes) => [...prevNotes, newNote]);
      setNote("");
      setImageUri(null);
      setVoiceMessage("");
      console.log("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setModalVisible(false); // Close the modal after selecting the image
    }
  };

  const handleCameraOpen = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setModalVisible(false); // Close the modal after taking a picture
      }
    } catch (error) {
      console.error("Error opening camera:", error);
    }
  };

  const uploadImage = async (uri: string) => {
    const mainLink = "http://10.0.0.240:8800/api/auth/upload";
    console.log("Uploading image...");

    try {
      console.log("Uploading image...1");
      const formData = new FormData();
      formData.append("image", {
        uri,
        name: `image_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      console.log("Uploading image...2");
      const uploadResponse = await axios.post(mainLink, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Uploading image...3");

      if (uploadResponse.status !== 200) {
        throw new Error("Image upload failed.");
      }

      return uploadResponse.data.imageUrl || null;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  const startVoiceRecording = async () => {
    Speech.speak("Please say your message");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* <Text style={styles.title}>Patient Notes</Text> */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.notesContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
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
              <Text style={styles.NoNotes}>No notes available!</Text>
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

        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity>

        {/* Voice message */}
        <TouchableOpacity
          style={styles.voiceButton}
          onPress={startVoiceRecording}
        >
          <Text style={styles.iconText}>🎤</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={addNote}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for image options */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Option</Text>
            <TouchableOpacity onPress={handleCameraOpen}>
              <Text style={styles.modalOption}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImagePick}>
              <Text style={styles.modalOption}>Choose Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalOption}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  innerContainer: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  notesContainer: { flexGrow: 1, paddingBottom: 100 },

  NoNotes: {
    fontSize: 24,
    textAlign: "center",
    justifyContent: "center",
    marginTop: "70%",
  },

  noteBubble: {
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: "80%",
  },

  noteAuthor: { fontWeight: "bold", color: "#075E54" },
  noteText: { fontSize: 16, marginVertical: 5 },

  noteImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginTop: 5,
    resizeMode: "cover",
  },

  noteDate: { fontSize: 12, color: "gray", alignSelf: "flex-end" },

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

  imageButton: { marginLeft: 10, padding: 8 },
  voiceButton: { marginLeft: 10, padding: 8 },

  iconText: { fontSize: 22 },

  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#0078D4",
    borderRadius: 20,
  },

  sendText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Image Preview for Selected Image
  imagePreviewWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },

  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 5,
  },

  closeText: { color: "#fff", fontSize: 14, fontWeight: "bold" },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },

  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  modalOption: { fontSize: 16, marginVertical: 10, textAlign: "center" },
});

export default Notes;
