import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    initializeAuth, 
    signInWithEmailAndPassword,
    indexedDBLocalPersistence
} from "firebase/auth";
import Constants from "expo-constants";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import { uploadImage } from "@/services/api";



import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
    projectId: Constants.expoConfig?.extra?.firebaseProjectId,
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
    appId: Constants.expoConfig?.extra?.firebaseAppId,
    measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
  };

  console.log(Constants.expoConfig?.extra?.firebaseApiKey, 'agyaaa');

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence
});



export { auth, signInWithEmailAndPassword, storage, ref, uploadBytes, getDownloadURL, app };
export const uploadImageToDatabase = async (imageUri: string): Promise<string | null> => {
    try {
        const { uri } = await FileSystem.getInfoAsync(imageUri);
        const file = await fetch(uri);
        const blob = await file.blob(); // Convert file to a blob



        // Create a reference to where the file will be stored in Firebase
        const fileRef = ref(storage, `images/${uri.split('/').pop()}`); // Use filename from URI

        // Upload the file to Firebase Storage
        const uploadResult = await uploadBytes(fileRef, blob);

        // Get the download URL after successful upload
        const uploadedImageUrl = await getDownloadURL(uploadResult.ref);

        // const uploadedImageUrl = await UO(uploadResult.ref);


        console.log(uploadedImageUrl, "uploaded image");
        // Set the uploaded image URL (use your own state management here)
        // setUploadedImageUrl(uploadedImageUrl);
        return uploadedImageUrl;

    } catch (error) {
        console.log("Error getting file info", error);
        return null
    }
};
