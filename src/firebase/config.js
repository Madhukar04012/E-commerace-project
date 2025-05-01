import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZBv5kWUTKt17owEg86U1_Z-CHtNzF_DM",
  authDomain: "ecommerce-website-00001.firebaseapp.com",
  projectId: "ecommerce-website-00001",
  storageBucket: "ecommerce-website-00001.firebasestorage.app",
  messagingSenderId: "131307342518",
  appId: "1:131307342518:web:95d90f3c43dac4a4c63417"
};

let app;
let auth;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Initialize with null values to prevent app from crashing
  app = null;
  auth = null;
  db = null;
}

export { auth, db };
export default app; 