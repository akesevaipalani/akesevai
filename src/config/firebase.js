// Firebase Configuration and Initialization with Environment Variable Fallbacks
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC8LwAPM1ZLoYdrt-tIVjxELk2gTKmu1H0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "akesevai-3bc99.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "akesevai-3bc99",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "akesevai-3bc99.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "247480748558",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:247480748558:web:ac98c1f1acdb8c1ec90a5f"
};

// Check if Firebase environment variables are configured
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes("DemoKey")
  );
};

// Initialize Firebase App singleton safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
