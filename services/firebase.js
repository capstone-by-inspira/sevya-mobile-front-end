import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth , provider};
