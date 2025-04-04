import React, { useEffect, useState, useContext } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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

import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  app,
  db,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "@/config/firebase"; // Adjust the path as necessary
import { AppContext } from "@/components/AppContext";

import { SelectList } from "react-native-dropdown-select-list";

import {
  translatePatientNotes,
  updateDocument,
  uploadImage,
} from "@/services/api";
import NoteCard from "@/components/NotesCard";
import Icon from "react-native-vector-icons/FontAwesome"; // Or MaterialIcons

import {
  formatDateOnly,
  formatLocalDateTime,
  formatTimeOnly,
} from "@/services/utils";
import AudioPlayer from "@/components/AudioPlayer";

const Notes = () => {
  const { id, singlePatientData, singleCaregiverData } = useLocalSearchParams(); // Get patient ID

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [translatedNotes, setTranslatedNotes] = useState<{
    [key: number]: string;
  }>({});
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [voiceMessage, setVoiceMessage] = useState("");

  const [fullImageUri, setFullImageUri] = useState<string | null>(null); // New state for full image

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

  const caregiverDataString = Array.isArray(singleCaregiverData)
    ? singleCaregiverData[0]
    : singleCaregiverData;
  const patient = JSON.parse(patientDataString);
  // const caregiver = JSON.parse(caregiverDataString);

  const [notes, setNotes] = useState(patient?.notes);
  const [patientData, setPatientData] = useState(patient);
  const [caregiverData, setCaregiverData] = useState(
    JSON.parse(caregiverDataString)
  );
  // console.log(caregiverData.image, "dddd.>>>>>>>");

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

  const navigation = useNavigation();
  useEffect(() => {
    if (patient) {
      navigation.setOptions({ title: `Notes` }); // Set the header title
    }
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
    console.log("Adding note...");

    if (!id || (!note.trim() && !imageUri && !voiceMessage && !voiceUri))
      return;

    try {
      const userData = await getSecureData("user");
      if (!userData) {
        console.error("User data not found.");
        return;
      }

      const user = JSON.parse(userData);
      console.log("Got userData");

      if (!user?.name) {
        console.error("User name is missing.");
        return;
      }

      let uploadedImageUrl = null;
      let uploadedAudioUrl: string | null = null;
      if (imageUri) {
        uploadedImageUrl = await uploadImage(imageUri);
      }

      // Upload audio if available
      if (voiceUri) {
        uploadedAudioUrl = await uploadAudio(voiceUri); // Assuming you have a function to upload audio
      }

      const newNote = {
        caregiverFirstName: caregiverData.firstName,
        caregiverLastName: caregiverData.lastName,
        caregiverImage: caregiverData.image,
        myNote: note || voiceMessage || "",
        imageUrl: uploadedImageUrl || null,
        audioUrl: uploadedAudioUrl || null,
        date: new Date().toISOString(),
      };
      // console.log(new Date(), "timeee/??????>>>>>>>>.");
      if (uploadedAudioUrl != null) {
        const docRef = doc(db, "patients", id as string);
        await updateDoc(docRef, {
          notes: arrayUnion(newNote),
        });

        setNotes((prevNotes) => [...prevNotes, newNote]);
        setNote("");
        setImageUri(null);
        setVoiceMessage("");
        setVoiceUri(null);
        console.log("Note added successfully!");
      } else {
        alert("voice message not uploaded!");
      }
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
    const mainLink = "https://sevya-admin.site:8808/api/auth/upload";
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

  // const uploadAudio = async (audioUri) => {
  //   const mainLink = "https://sevya-admin.site:8808/api/auth/upload-audio";
  //   const formData = new FormData();
  //   formData.append("audio", {
  //     uri: audioUri,
  //     type: "audio/mpeg", // Change type based on your file format (e.g., audio/wav, audio/mp3)
  //     name: `audio_${Date.now()}.mp3`, // You can dynamically set the file name
  //   } as any);

  //   try {
  //     const response = await axios.post(mainLink, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     return response.data.audioUrl; // Return the URL of the uploaded audio
  //   } catch (error) {
  //     console.error("Error uploading audio:", error);
  //     return null; // Return null if the upload fails
  //   }
  // };

  // To generate a unique filename

  const uploadAudio = async (audioUri) => {
    if (!audioUri) return null;

    try {
      const fileName = `audio_${Date.now()}.mp3`; // Generate a unique filename
      // Removed redundant redeclaration of storage
      const reference = ref(storage, `audio/${fileName}`);

      const response = await fetch(audioUri);
      const blob = await response.blob();

      // Upload the audio file
      await uploadBytes(reference, blob);

      // Get the uploaded file URL
      const audioUrl = await getDownloadURL(reference);
      clearRecording(); // Clear the recording after upload
      console.log("Audio uploaded successfully:", audioUrl);
      return audioUrl;
    } catch (error) {
      console.error("Error uploading audio:", error);
      return null;
    }
  };

  const handleImageLongPress = (imageUrl: string) => {
    setFullImageUri(imageUrl);
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false, // Set to false to use the loudspeaker
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true); // Hide text field and show recording indicator
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    if (uri) {
      setVoiceUri(uri); // Store the audio URI
    }

    // We only want to hide the recording indicator after the recording has been stopped
    setIsRecording(false);
    // Don't reset the recording state to null right away
  };

  const clearRecording = () => {
    setRecording(null); // Clear the recording object
    setVoiceUri(null); // Clear the voice URI
  };

  const playVoiceMessage = async () => {
    if (!voiceUri) return;

    const { sound } = await Audio.Sound.createAsync(
      { uri: voiceUri },
      { shouldPlay: true }
    );

    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  // Inside your render method or functional component

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8FBFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Today</Text>
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
                    <View style={styles.noteHeader}>
                      <Image
                        source={{ uri: item.caregiverImage }}
                        style={styles.noteAuthorImage}
                      />
                      <Text style={styles.noteAuthor}>
                        By
                        {" " +
                          item.caregiverFirstName +
                          " " +
                          item.caregiverLastName}
                      </Text>
                    </View>

                    <Text style={styles.noteDate}>
                      {formatTimeOnly(item.date)}
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

                  {item.imageUrl && (
                    <TouchableOpacity
                      onPress={() => handleImageLongPress(item.imageUrl)}
                    >
                      <Image
                        source={{ uri: item.imageUrl }}
                        resizeMode="cover"
                        style={styles.noteImage}
                      />
                    </TouchableOpacity>
                  )}

                  {item.audioUrl && (
                    <TouchableOpacity
                      onPress={() => {
                        setVoiceUri(item.audioUrl);
                        playVoiceMessage();
                      }}
                      style={styles.playButton}
                    >
                      {item.audioUrl && (
                        <AudioPlayer audioUrl={item.audioUrl} />
                      )}
                      {/* 
                      <Icon name="play" size={24} color="black" />
                      <Text style={styles.noteText}>Play Voice Note</Text> */}
                    </TouchableOpacity>
                  )}
                  {item.myNote !== "" && (
                    <Text
                      style={styles.noteTranslate}
                      onPress={() => translateNote(item.myNote, index)}
                    >
                      See Translate
                    </Text>
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
              style={styles.closeButtonFullImage}
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

        {/* {isRecording || recording !== null ? (
          <View style={styles.recordingIndicator}>
            <Icon name="microphone" size={24} color="red" />
            <Text style={styles.recordingText}>
              {isRecording ? "Recording..." : "Recording Stopped"}
            </Text>
          </View>
        ) : (
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Type a note...!"
            placeholderTextColor={"#999"}
            style={styles.textInput}
          />
        )} */}

        {isRecording || recording !== null ? (
          <View
            style={[
              styles.recordingIndicator,
              {
                backgroundColor:
                  isRecording || recording === null ? "#ffe6e6" : "#d4edda",
              },
            ]}
          >
            {isRecording ? (
              <>
                <Icon name="microphone" size={24} color="red" />
                <Text style={styles.recordingText}>Recording...</Text>
              </>
            ) : (
              <>
                <Icon name="check" size={24} color="green" />
                <Text style={[styles.recordingText, { color: "green" }]}>
                  Audio recorded!
                </Text>
                <TouchableOpacity onPress={clearRecording}>
                  <Icon name="close" size={24} color="gray" paddingLeft="30%" />
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Type a note...!"
            placeholderTextColor={"#999"}
            style={styles.textInput}
          />
        )}

        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
        ></TouchableOpacity>

        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => setModalVisible(true)}
        >
          {!isRecording && !recording && (
            <Icon name="camera" style={styles.vIcon} />
          )}
        </TouchableOpacity>

        {/* Voice message */}
        <View style={styles.voiceContainer}>
          <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
            style={styles.voiceButton}
          >
            {!voiceUri && (
              <Icon
                style={styles.vIcon}
                name={recording ? "stop" : "microphone"}
                size={24}
                // color="white"
              />
            )}
          </TouchableOpacity>
          {voiceUri && (
            <TouchableOpacity
              onPress={playVoiceMessage}
              style={styles.playButton}
            >
              <Icon
                style={[styles.vIcon, { paddingRight: 20 }]}
                name={isPlaying ? "pause" : "play"}
                size={24}
                // color="white"
              />
            </TouchableOpacity>
          )}
        </View>

        {!isRecording && (
          <TouchableOpacity style={styles.sendButton} onPress={addNote}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        )}
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
    fontSize: 18,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#F8FBFF",
  },

  notesContainer: { flexGrow: 1, paddingBottom: 100, overflowY: "scroll" },

  NoNotes: {
    fontSize: 24,
    textAlign: "center",
    justifyContent: "center",
    marginTop: "70%",
  },

  noteBubble: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    maxWidth: "100%",
    borderColor: "lightgray", // Outline color (blue in this case)
    borderWidth: 0.5, // Outline thickness
    shadowColor: "#000", // Shadow color (black)
    shadowOffset: { width: 0, height: 2 }, // Shadow position (slightly below the element)
    shadowOpacity: 0.1, // Shadow opacity (light shadow)
    shadowRadius: 3, // Shadow radius (light blur)
    elevation: 5, // For Android shadow effect
  },

  noteHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  noteAuthor: { color: "grey" },
  noteAuthorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  noteText: { fontSize: 14, marginVertical: 1, padding: 10 },

  noteImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    marginTop: 0,
    resizeMode: "cover",
    marginBottom: 15,
  },

  noteDate: { fontSize: 12, color: "gray" },
  noteTranslate: {
    fontSize: 12,
    color: "gray",
    textAlign: "right",
    fontStyle: "italic",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,

    paddingBottom: 25,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingHorizontal: 20,
  },

  textInput: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "auto",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 18,
    padding: 12,
    fontSize: 16,

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
    borderRadius: 30,
    display: "flex",
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    alignItems: "center",
    width: 150,
    borderRadius: 40,
    backgroundColor: "#ffffff",
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    position: "absolute",
    top: 40,
    right: 0,
    width: 150,
    zIndex: 99,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    borderRadius: 15,
    resizeMode: "cover",
  },
  closeButtonFullImage: {
    position: "absolute",
    top: 50,
    right: 25,
    backgroundColor: "lightgray",
    borderRadius: 10,
    padding: 5,
    zIndex: 99,
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
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

  voiceContainer: {
    // backgroundColor: "#f8f9fa",
    // padding: 20,
    borderRadius: 10,
    // width: 300,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    margin: "auto",
  },

  playButton: {
    // backgroundColor: "#4caf50",
    // color: "blue",
    // border: "none",
    // padding: 20,
    fontSize: 16,
    borderRadius: 5,
    cursor: "pointer",
    // transition: "background-color 0.3s ease",
  },

  playButtonHover: {
    backgroundColor: "#45a049",
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    padding: 10,
    borderRadius: 10,
  },
  recordingText: {
    // marginLeft: 10,
    // paddingLeft: 10,
    color: "red",
    fontWeight: "bold",
  },
});

export default Notes;
