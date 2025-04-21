
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  User,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";

// Your Firebase configuration
// Replace this with actual Firebase config when deploying
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyReplace-This-With-Actual-Key",
  authDomain: "vaidpr-blog.firebaseapp.com",
  projectId: "vaidpr-blog",
  storageBucket: "vaidpr-blog.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to local to persist user sessions
setPersistence(auth, browserLocalPersistence);

// Auth helpers
export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

// Get auth token for API requests
export const getAuthToken = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  return user.getIdToken();
};
