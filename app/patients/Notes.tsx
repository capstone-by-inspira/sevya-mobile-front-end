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
import Icon from "react-native-vector-icons/FontAwesome"; // Or MaterialIcons

const Notes = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [notes, setNotes] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [fullImageUri, setFullImageUri] = useState<string | null>(null); // New state for full image

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
    const mainLink = "http://3.227.60.242:8808/api/auth/upload";
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

  // Function to handle long press on image
  const handleImageLongPress = (imageUrl: string) => {
    setFullImageUri(imageUrl);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8FBFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
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
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteAuthor}>
                      by
                      {" " +
                        item.caregiverName.charAt(0).toUpperCase() +
                        item.caregiverName.slice(1)}
                    </Text>
                    <Text style={styles.noteDate}>
                      {new Date(item.date.seconds * 1000).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </Text>
                  </View>
                  <Text style={styles.noteText}>{item.myNote}</Text>
                  {item.imageUrl && (
                    <TouchableOpacity
                      onLongPress={() => handleImageLongPress(item.imageUrl)}
                    >
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.noteImage}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.NoNotes}>No notes available!</Text>
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal for viewing full image */}
      {fullImageUri && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.fullImageModal}>
            <Image source={{ uri: fullImageUri }} style={styles.fullImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFullImageUri(null)}
            >
              <Text style={styles.FullcloseText}>✖</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

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
          placeholderTextColor={"#ccc"}
          multiline
        />

        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="camera" style={styles.vIcon} />
        </TouchableOpacity>

        {/* Voice message */}
        {/* <TouchableOpacity
          style={styles.voiceButton}
          onPress={startVoiceRecording}
        >
          <Icon name="microphone" style={styles.vIcon} />
        </TouchableOpacity> */}

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



const styles = StyleSheet.create({
  innerContainer: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#F8FBFF",
  },
  notesContainer: { flexGrow: 1, paddingBottom: 100 },

  NoNotes: {
    fontSize: 24,
    textAlign: "center",
    justifyContent: "center",
    marginTop: "70%",
  },

  noteBubble: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: "80%",
    borderColor: "lightgray", // Outline color (blue in this case)
    borderWidth: 0.5, // Outline thickness
    shadowColor: "#000", // Shadow color (black)
    shadowOffset: { width: 0, height: 2 }, // Shadow position (slightly below the element)
    shadowOpacity: 0.1, // Shadow opacity (light shadow)
    shadowRadius: 3, // Shadow radius (light blur)
    elevation: 5, // For Android shadow effect
  },

  // New container for the author and date in a row
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  noteAuthor: { color: "grey" },
  noteText: { fontSize: 14, marginVertical: 1 },

  noteImage: {
    width: "auto",
    height: 140,
    borderRadius: 8,
    marginTop: 0,
    resizeMode: "cover",
    marginBottom: 7,
  },

  noteDate: { fontSize: 12, color: "gray", alignSelf: "flex-end" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingBottom: 24,
  },

  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingLeft: 12,
    fontSize: 16,
    paddingTop: 10,
    backgroundColor: "#f0f0f0",
  },

  imageButton: { marginLeft: 10, padding: 8 },
  voiceButton: { marginLeft: 10, padding: 8 },

  vIcon: {
    fontSize: 22,
    color: "#0078D4",
    margin: 0,
    padding: 0,
  },

  sendButton: {
    marginLeft: 5,
    marginRight: 5,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "#0078D4",
    borderRadius: 20,
  },

  sendText: { color: "#fff", fontSize: 14, fontWeight: "bold" },

  // Image Preview for Selected Image
  imagePreviewWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  fullImageModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    resizeMode: "cover",
  },

  closeButton: {
    position: "absolute",
    top: 80,
    right: 20,
    backgroundColor: "lightgray",
    borderRadius: 10,
    padding: 5,
  },

  FullcloseText: {
    fontSize: 20,
    fontWeight: 100,
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
