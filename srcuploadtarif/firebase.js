import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbKdESSAhUxL31yGt9q-AywfW7qwm-Kmc",
  authDomain: "bapendajateng-c7ee2.firebaseapp.com",
  projectId: "bapendajateng-c7ee2",
  storageBucket: "bapendajateng-c7ee2.firebasestorage.app",
  messagingSenderId: "170157159924",
  appId: "1:170157159924:web:1a6f83f0118b5f7fc335a1",
  measurementId: "G-Y8SYS04SS9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);