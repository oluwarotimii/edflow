import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence, Auth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once
let auth: Auth;
let db: Firestore;

// Firebase initialization function
function initializeFirebase() {
  // Only initialize Firebase if it hasn't been initialized yet
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  // Initialize auth and db services
  auth = getAuth(app);
  db = getFirestore(app);

  // Set persistence for auth only in the browser
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserSessionPersistence)
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });

    // Monitor auth state changes
    onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User is signed in' : 'User is signed out');
    });
  }
}

// Ensure Firebase is initialized
initializeFirebase();

// Export auth and db
export { auth, db };
