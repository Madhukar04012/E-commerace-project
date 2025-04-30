import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBj6U4z5YgxMj0fAQQZ-0m0-O-MHdLQoXk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "styleshop-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "styleshop-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "styleshop-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abc123def456ghi789jkl"
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