import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  signInWithEmailAndPassword,
  indexedDBLocalPersistence,
} from "firebase/auth";
import Constants from "expo-constants";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { uploadImage } from "@/services/api";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

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

console.log(Constants.expoConfig?.extra?.firebaseApiKey, "agyaaa");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
});

export {
  db,
  auth,
  signInWithEmailAndPassword,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  app,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
};
