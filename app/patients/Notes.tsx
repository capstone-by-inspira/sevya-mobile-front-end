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
  Modal,
  Alert,
} from "react-native";
import { getSecureData } from "../../services/secureStorage";
import { useLocalSearchParams, useNavigation } from "expo-router";


import { storage ,ref, uploadBytes, getDownloadURL} from '@/config/firebase'; // Adjust the path as necessary


import { SelectList } from "react-native-dropdown-select-list";
import {
  translatePatientNotes,
  updateDocument,
  uploadImage,
} from "@/services/api";
import NoteCard from "@/components/NotesCard";
import Icon from "react-native-vector-icons/FontAwesome"; // Or MaterialIcons
import { formatDateOnly, uriToFile } from "@/services/utils";

const Notes = () => {
  const { singlePatientData } = useLocalSearchParams(); // Get patient ID
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  // const [notes, setNotes] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [translatedNotes, setTranslatedNotes] = useState<{
    [key: number]: string;
  }>({});
  const [fullImageUri, setFullImageUri] = useState<string | null>(null); // New state for full image

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
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

  const patientDataString = Array.isArray(singlePatientData)
    ? singlePatientData[0]
    : singlePatientData;

  const patient = JSON.parse(patientDataString);

  const [notes, setNotes] = useState(patient?.notes);
  const [patientData, setPatientData] = useState(patient);

  useEffect(() => {
    if (patient) {
      setLoading(false); // Set the header title
    }
  }, [patient]);

  const navigation = useNavigation();
  useEffect(() => {
    if (patient) {
      navigation.setOptions({ title: `Notes` }); // Set the header title
    }
  }, [patient, navigation]);

  const translateNote = async (text: string, index: number) => {
    try {
      const targetLang =
        languages.find((lang) => lang.value === selectedLanguage)?.key || "en";

      const patientData = {
        notes: text,
        language: targetLang,
      };

      const response = await translatePatientNotes(patientData);
      console.log("translated", response);
      const translatedText =
        response.translatedText.data.translations[0].translatedText;
      console.log("result", translatedText);
      setTranslatedNotes((prev) => ({
        ...prev,
        [index]: translatedText,
      }));
    } catch (error: any) {
      console.error("Translation failed:", error.message);
    }
  };

  // Add a new note to Firebase
  const addNote = async () => {
    if (!patient || !note.trim()) return;

    try {
      // Retrieve caregiver's name from user data
      const userData = await getSecureData("user");
      const token = await getSecureData("token");

      if (!userData) {
        console.error("User data not found.");
        return;
      }

      const user = JSON.parse(userData); // Parse JSON only if userData exists

      if (!user?.name) {
        console.error("User name is missing.");
        return;
      }

      // Create a new note object
      const newNote = {
        caregiverName: user.name, // Use the actual caregiver name from user data
        myNote: note,
        date: new Date(),
        imageUrl: uploadedImageUrl || null, // Add image URL if available
      };

      // Update the patient's notes array in Firestore
      const updatedNotes = patient?.notes
        ? [...patient.notes, newNote]
        : [newNote];

      // Add the new note to the existing notes array

      // Update the patient document in Firestore
      const updateData = {
        notes: updatedNotes, // Replace the entire notes array with the updated one
      };

      const updateResult = await updateDocument(
        "patients",
        patient.id, // Use the patient ID
        updateData,
        token
      );

      if (updateResult.success) {
        // Update local state and clear input field
        setPatientData((prev) => ({
          ...prev,
          notes: updatedNotes,
        }));

        setNotes(updatedNotes); // Update local notes state
        setNote(""); // Clear input
        setImageUri(null); // Clear image URI
        console.log("Note added successfully!");
      } else {
        console.error("Failed to update patient document.");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleImageLongPress = (imageUrl: string) => {
    setFullImageUri(imageUrl);
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
        console.log(result.assets[0].uri, "image-resu;t");
        try {
          // Convert the URI to a File object
          const file = await uriToFile(imageUri, `photo_${Date.now()}.jpg`);

          console.log(file, "file object"); // This will log the File object with the desired structure

          // Now upload the file to Firebase
          const uploadedImageUrl = await uploadImage(file);
          if (uploadedImageUrl.success) {
            console.log(uploadedImageUrl.imageUrl, "uploaded image");
            setUploadedImageUrl(uploadedImageUrl.imageUrl);

            setModalVisible(false); // Close modal
          }
        } catch (error) {
          console.error("Image upload failed", error);
        }
        setModalVisible(false); // Close the modal after taking a picture
      }
    } catch (error) {
      console.error("Error opening camera:", error);
    }
  };
  
  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImageUri(imageUri); // Set local preview
      console.log(imageUri, "image-result");
  
      try {
        // Convert the URI to a File object
        const file = await uriToFile(imageUri, `photo_${Date.now()}.jpg`);
  
        console.log(file, "file object"); // This will log the File object with the desired structure
        if (file) {
          // Create a storage reference
          const storageRef = ref(storage, `images/${file.name}`);
  
          // Upload the file
          await uploadBytes(storageRef, file);
          console.log("File uploaded successfully");
  
          // Get the download URL
          const uploadedImageUrl = await getDownloadURL(storageRef);
          console.log(uploadedImageUrl, "uploaded image");
          setUploadedImageUrl(uploadedImageUrl);
  
          setModalVisible(false); // Close modal
        }
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };
  
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8FBFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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
            style={{ flex: 1 }}
            contentContainerStyle={styles.notesContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            {loading ? (
              <Text>Loading...</Text>
            ) : notes?.length > 0 ? (
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
                      {formatDateOnly(item.date)}
                    </Text>
                  </View>
                  <Text style={styles.noteText}>{item.myNote}</Text>

                  {/* Show translated text if available */}
                  {translatedNotes[index] && (
                    <Text
                      style={[
                        styles.noteText,
                        { fontStyle: "italic", color: "gray" },
                      ]}
                    >
                      {translatedNotes[index]}
                    </Text>
                  )}

                  <Text
                    style={styles.noteDate}
                    onPress={() => translateNote(item.myNote, index)}
                  >
                    Translate
                  </Text>
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
    // backgroundColor: 'white',
    // display: "flex",
    // justifyContent: 'center',
    // alignItems: 'center',

    // flex: 1,
    // padding: 10,
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
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
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
