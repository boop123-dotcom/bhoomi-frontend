
// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase project configuration (kept from your working setup)
const firebaseConfig = {
  apiKey: "AIzaSyAeeV3f9P89_a0h0xiuimJZgBHQfKUujiw",
  authDomain: "motivationappauth-4d5b2.firebaseapp.com",
  projectId: "motivationappauth-4d5b2",
  storageBucket: "motivationappauth-4d5b2.appspot.com",
  messagingSenderId: "669271314766",
  appId: "1:669271314766:web:8be0ca8289ae7b8c0a4e1f"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth setup
export const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => console.log("Auth persistence set to session only"))
  .catch((error) => console.error("Error setting persistence:", error));

// ✅ Firestore (used to store sustainability actions, charts, etc.)
export const db = getFirestore(app);
