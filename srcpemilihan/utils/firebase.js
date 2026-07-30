import { getDb } from "../config/firebase";

export { app } from "../config/firebase";

let db = null;

export const getFirebaseDb = async () => {
  if (!db) {
    db = await getDb();
  }
  return db;
};
