// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtekFH3hGoIGqpn-m1CM9M5bA09qmMW88",
  authDomain: "venturemafia-e1278.firebaseapp.com",
  projectId: "venturemafia-e1278",
  storageBucket: "venturemafia-e1278.appspot.com",
  messagingSenderId: "500267624550",
  appId: "1:500267624550:web:afd673293094ac8c0c25a7",
  measurementId: "G-TP1PT6JE58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics, logEvent };