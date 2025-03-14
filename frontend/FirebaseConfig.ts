import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt1ZO5RM8UIKjiVcN_5EWtLPHjRM1bGn8",
  authDomain: "staterapp-a0586.firebaseapp.com",
  projectId: "staterapp-a0586",
  storageBucket: "staterapp-a0586.firebasestorage.app",
  messagingSenderId: "377474890106",
  appId: "1:377474890106:web:f7fa012ee8d6effd687ec3",
  measurementId: "G-CCKE5D6LB2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to local
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Export services
export const FIREBASE_AUTH = auth;
export const FIREBASE_DB = getFirestore(app);
export const FIREBASE_STORAGE = getStorage(app);

// Export app instance
export default app;
