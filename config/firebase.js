// Import the required Firebase functions
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBElpKByBToZkWBwH4eZzJM-MMQxsB1Lrw",
  authDomain: "edflow-2024.firebaseapp.com",
  projectId: "edflow-2024",
  storageBucket: "edflow-2024.appspot.com",
  messagingSenderId: "692165295336",
  appId: "1:692165295336:web:b5193d968f25d6c6f11d5d",
  databaseURL: "https://edflow-2024-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const database = getDatabase(app);

// Export the database object for use in other files
export { database, ref, set, get, onValue };
