// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔹 Replace with your actual Firebase config

const firebaseConfig = {
    apiKey: "AIzaSyBX2gmQbTyv77Bep4DKVQrC--OVSx37q7s",
    authDomain: "sevya-f77df.firebaseapp.com",
    projectId: "sevya-f77df",
    storageBucket: "sevya-f77df.firebasestorage.app",
    messagingSenderId: "62869950842",
    appId: "1:62869950842:web:f0f59cb17ec508dbd786c3",
    measurementId: "G-E5Q564BTJ1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
