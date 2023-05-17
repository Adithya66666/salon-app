import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-7K7Ax8KRhMyO4FxWxuRbljOMiu6IWUE",
  authDomain: "salonapp-497bb.firebaseapp.com",
  projectId: "salonapp-497bb",
  storageBucket: "salonapp-497bb.appspot.com",
  messagingSenderId: "968348502066",
  appId: "1:968348502066:web:e74ed4273733bd0b4d542b",
  measurementId: "G-J2LH3TYQMG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getDatabase(app)