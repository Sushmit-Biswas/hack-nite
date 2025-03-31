// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALYvoQdtd77OqEltGmt-c1j8mru8mSfyA",
  authDomain: "mockmate-70379.firebaseapp.com",
  projectId: "mockmate-70379",
  storageBucket: "mockmate-70379.firebasestorage.app",
  messagingSenderId: "684502068728",
  appId: "1:684502068728:web:44b5a02b23f8c4fc527a0d",
  measurementId: "G-8NX4SN772W"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);