import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6TccE84ngSF0QaJ3zHD4wDP-P2gAyTuY",
  authDomain: "diskumperindag-aae4f.firebaseapp.com",
  databaseURL: "https://diskumperindag-aae4f-default-rtdb.firebaseio.com",
  projectId: "diskumperindag-aae4f",
  storageBucket: "diskumperindag-aae4f.firebasestorage.app",
  messagingSenderId: "736500223311",
  appId: "1:736500223311:web:500b12da2a84e1bd3bc93a",
  measurementId: "G-WVWZ3F76VR",
};

const app = initializeApp(firebaseConfig);

let db = null;

export function getDb() {
  if (!db) {
    try {
      db = getFirestore(app);
      console.log("[v0] Firestore initialized successfully");
    } catch (error) {
      console.error("[v0] Firestore initialization error:", error);
      throw new Error(
        `Firestore gagal initialize.\n\nError: ${error.message}\n\nSolusi:\n` +
          "1. Pastikan Cloud Firestore Database sudah dibuat di Firebase Console\n" +
          "2. Jika baru dibuat, tunggu 5-10 menit untuk propagasi\n" +
          "3. Pastikan network/internet connection stabil\n" +
          "4. Refresh halaman dan coba lagi"
      );
    }
  }
  return db;
}

export { app };
