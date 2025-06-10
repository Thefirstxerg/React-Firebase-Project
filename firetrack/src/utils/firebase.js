import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbFlhFkvv9uuvFVHCqoMr7v6Yc3CVy7Hg",
  authDomain: "firetrack-60d16.firebaseapp.com",
  projectId: "firetrack-60d16",
  storageBucket: "firetrack-60d16.firebasestorage.app",
  messagingSenderId: "473761945291",
  appId: "1:473761945291:web:850c70492ffc6f4418ad4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);