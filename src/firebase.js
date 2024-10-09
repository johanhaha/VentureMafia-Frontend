// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log(
  "Logging disabled",
  process.env.REACT_APP_ANALYTICS_DISABLED
);
// Wrapper function for logging events
const logEvent = (analytics, eventName, eventParams) => {
  if (process.env.REACT_APP_ANALYTICS_DISABLED === "true") {
    // Analytics is disabled
    console.log(
      `Analytics disabled. Event ${eventName} ${eventParams.item_name} not logged.`
    );
  } else {
    firebaseLogEvent(analytics, eventName, eventParams.item_name);
  }
};

export { analytics, logEvent };