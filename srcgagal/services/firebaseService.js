import { db, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"

// Function to save contact information
export async function saveContactInfo({
  entityId,
  type = "opd", // 'opd' | 'uppd'
  email,
  whatsapp,
  extra = {},
}) {
  // Fail fast with a clear message for easy tracing from the page
  if (!entityId) {
    const err = new Error("Missing OPD/UPPD id when saving contact.")
    // Informative logging
    console.error("[Firebase] saveContactInfo failed: entityId is undefined/null. Payload:", {
      type,
      email,
      whatsapp,
      extra,
    })
    throw err
  }

  // Determine the collection based on type
  const collectionName = type === "uppd" ? "uppdContacts" : "opdContacts"

  // Assume variables db, doc, setDoc, serverTimestamp are already imported in this file
  const ref = doc(db, collectionName, String(entityId))

  const payload = {
    email: email || null,
    whatsapp: whatsapp || null,
    ...extra, // save additional fields if any
    updatedAt: serverTimestamp(),
  }

  console.log("[Firebase] Saving contact", { collectionName, entityId, payload })
  await setDoc(ref, payload, { merge: true })

  return { success: true, id: entityId, type }
}

// Alias for compatibility with old code that might still call saveContact
export const saveContact = saveContactInfo

// Helper function to read contact details
export async function getContactInfo({ entityId, type = "opd" }) {
  if (!entityId) throw new Error("Missing OPD/UPPD id when getting contact.")
  const collectionName = type === "uppd" ? "uppdContacts" : "opdContacts"
  const ref = doc(db, collectionName, String(entityId))
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: entityId, type, ...snap.data() }
}
