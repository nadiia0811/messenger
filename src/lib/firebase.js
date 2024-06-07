import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  /* apiKey: "AIzaSyA_sDU5rCOicdj2qbP9DnbMYQzQbnlnxcw", */
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-e0acb.firebaseapp.com",
  projectId: "reactchat-e0acb",
  storageBucket: "reactchat-e0acb.appspot.com",
  messagingSenderId: "340720916971",
  appId: "1:340720916971:web:3ae5df2ab75114b2d3e1ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();