// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCraQviZFsN5DNtATLHS7R4JdqvBH0le_I",
  authDomain: "stream-platform-2025.firebaseapp.com",
  projectId: "stream-platform-2025",
  storageBucket: "stream-platform-2025.appspot.com",
  messagingSenderId: "6102817020",
  appId: "YOUR_GENERATED_APP_ID"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
