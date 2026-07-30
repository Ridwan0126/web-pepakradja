import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getDb } from "../config/firebase";

export { getDb };

// User CRUD Operations
export const createUser = async (userData) => {
  try {
    const db = await getDb();

    // Check if user already exists by username
    const existingUser = await getUserByUsername(userData.username);
    if (existingUser) {
      throw new Error("Username sudah terdaftar");
    }

    const docRef = await addDoc(collection(db, "pengguna"), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUserByUsername = async (namaAkun) => {
  try {
    // Validate input to prevent "undefined" in where clause
    if (!namaAkun || namaAkun.trim() === "") {
      console.error("Username tidak boleh kosong");
      return null;
    }

    const db = await getDb();
    const q = query(
      collection(db, "pengguna"),
      where("namaAkun", "==", namaAkun.trim()),
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const db = await getDb();

    const docRef = doc(db, "pengguna", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const db = await getDb();

    const querySnapshot = await getDocs(collection(db, "pengguna"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const db = await getDb();

    const docRef = doc(db, "pengguna", userId);
    await updateDoc(docRef, {
      ...userData,
      updatedAt: new Date(),
    });
    return { id: userId, ...userData };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const db = await getDb();

    const docRef = doc(db, "pengguna", userId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Seed initial users
export const seedInitialUsers = async () => {
  try {
    const initialUsers = [
      {
        id: 1,
        namaPanitia: "Admin System",
        role: "ketua",
        level: "Ketua Panitia",
        wilayah: "",
        nomorHP: "+62-8123456789",
        namaAkun: "admin",
        password: "admin123",
      },
      {
        id: 2,
        namaPanitia: "Koordinator Wilayah",
        role: "koordinator",
        level: "Koordinator/Anggota",
        wilayah: "Desa-01",
        nomorHP: "+62-8129876543",
        namaAkun: "koordinator",
        password: "koord123",
      },
    ];

    const results = { success: 0, failed: 0, errors: [] };

    for (const user of initialUsers) {
      try {
        const existingUser = await getUserByUsername(user.namaAkun);
        if (existingUser) {
          console.log(`User ${user.namaAkun} sudah ada`);
          continue;
        }

        await createUser(user);
        results.success++;
        console.log(`User ${user.namaAkun} berhasil dibuat`);
      } catch (error) {
        results.failed++;
        results.errors.push({ namaAkun: user.namaAkun, error: error.message });
        console.error(`Error creating user ${user.namaAkun}:`, error);
      }
    }

    return results;
  } catch (error) {
    console.error("Error seeding initial users:", error);
    throw error;
  }
};

// Settings management functions
export const getPengaturan = async () => {
  try {
    const db = await getDb();
    const docRef = doc(db, "settings", "pengaturan");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting pengaturan:", error);
    throw error;
  }
};

export const savePengaturan = async (data) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "settings", "pengaturan");
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
    return { id: "pengaturan", ...data };
  } catch (error) {
    console.error("Error saving pengaturan:", error);
    throw error;
  }
};

// Candidates management functions
export const getAllCandidates = async () => {
  try {
    const db = await getDb();
    const querySnapshot = await getDocs(collection(db, "calon"));
    return querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => a.nomorUrut - b.nomorUrut);
  } catch (error) {
    console.error("Error getting candidates:", error);
    throw error;
  }
};

export const createCandidate = async (candidateData) => {
  try {
    const db = await getDb();
    const docRef = await addDoc(collection(db, "calon"), {
      ...candidateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...candidateData };
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};

export const updateCandidate = async (candidateId, candidateData) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "calon", candidateId);
    await updateDoc(docRef, {
      ...candidateData,
      updatedAt: new Date(),
    });
    return { id: candidateId, ...candidateData };
  } catch (error) {
    console.error("Error updating candidate:", error);
    throw error;
  }
};

export const deleteCandidate = async (candidateId) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "calon", candidateId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};

export const checkCandidateHasVotes = async (candidateId) => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, "votes"),
      where("calonId", "==", candidateId),
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking votes:", error);
    throw error;
  }
};

// Region management functions
export const getKelompokPemilih = async () => {
  try {
    const db = await getDb();
    const docRef = doc(db, "settings", "kelompokPemilih");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().value || "RW";
    }
    return "RW";
  } catch (error) {
    console.error("Error getting kelompok pemilih:", error);
    return "RW";
  }
};

export const saveKelompokPemilih = async (kelompok) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "settings", "kelompokPemilih");
    await setDoc(docRef, { value: kelompok });
    return kelompok;
  } catch (error) {
    console.error("Error saving kelompok pemilih:", error);
    throw error;
  }
};

export const getAllRegions = async () => {
  try {
    const db = await getDb();
    const querySnapshot = await getDocs(collection(db, "wilayah"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting regions:", error);
    throw error;
  }
};

export const createRegion = async (regionData) => {
  try {
    const db = await getDb();
    const docRef = await addDoc(collection(db, "wilayah"), {
      ...regionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...regionData };
  } catch (error) {
    console.error("Error creating region:", error);
    throw error;
  }
};

export const updateRegion = async (regionId, regionData) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "wilayah", regionId);
    await updateDoc(docRef, {
      ...regionData,
      updatedAt: new Date(),
    });
    return { id: regionId, ...regionData };
  } catch (error) {
    console.error("Error updating region:", error);
    throw error;
  }
};

export const deleteRegion = async (regionId) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "wilayah", regionId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting region:", error);
    throw error;
  }
};

export const checkRegionHasVoters = async (wilayahName) => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, "pemilih"),
      where("wilayah", "==", wilayahName),
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking voters:", error);
    throw error;
  }
};

// Voter management functions
export const getAllVoters = async () => {
  try {
    const db = await getDb();
    const querySnapshot = await getDocs(collection(db, "pemilih"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting voters:", error);
    throw error;
  }
};

export const createVoter = async (voterData) => {
  try {
    const db = await getDb();
    const docRef = await addDoc(collection(db, "pemilih"), {
      ...voterData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...voterData };
  } catch (error) {
    console.error("Error creating voter:", error);
    throw error;
  }
};

export const updateVoter = async (voterId, voterData) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "pemilih", voterId);
    await updateDoc(docRef, {
      ...voterData,
      updatedAt: new Date(),
    });
    return { id: voterId, ...voterData };
  } catch (error) {
    console.error("Error updating voter:", error);
    throw error;
  }
};

export const deleteVoter = async (voterId) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "pemilih", voterId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting voter:", error);
    throw error;
  }
};

export const checkVoterHasVoted = async (voterId) => {
  try {
    const db = await getDb();
    const q = query(collection(db, "votes"), where("pemilihId", "==", voterId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking votes:", error);
    throw error;
  }
};

// Offline Votes management functions
export const getAllOfflineVotes = async () => {
  try {
    const db = await getDb();
    const querySnapshot = await getDocs(collection(db, "votesOffline"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting offline votes:", error);
    return [];
  }
};

export const createOfflineVote = async (voteData) => {
  try {
    const db = await getDb();

    // VALIDASI WAJIB
    if (!voteData.pemilihId) {
      throw new Error("Missing required field: pemilihId");
    }

    if (voteData.statusSuara === "SAH" && !voteData.calonId) {
      throw new Error("Missing required field: calonId untuk suara SAH");
    }

    const isSah = voteData.statusSuara === "SAH";

    const docRef = await addDoc(collection(db, "votesOffline"), {
      // ================= PEMILIH =================
      pemilihId: voteData.pemilihId,
      namaPemilih: voteData.namaPemilih || null,
      nomorTelepon: voteData.nomorTelepon || null,
      nomorRumah: voteData.nomorRumah || null,
      wilayahId: voteData.wilayahId || null,
      wilayahNama: voteData.wilayahNama || null,

      // ================= CALON (AMAN) =================
      calonId: isSah ? voteData.calonId : null,
      nomorUrut: isSah ? voteData.nomorUrut : null,
      calonNama: isSah ? voteData.calonNama : "-",
      namaKetua: isSah ? voteData.namaKetua || voteData.calonNama : "-",
      namaWakil: isSah ? voteData.namaWakil || null : "-",

      // ================= SUARA =================
      statusSuara: voteData.statusSuara || "SAH",
      caraMemilih: "offline",
      tipeRekaman: "suaraOffline",

      // ================= WAKTU =================
      createdAt: new Date(),
      updatedAt: new Date(),
      timestamp: voteData.timestamp || new Date().toISOString(),
    });

    return { id: docRef.id, ...voteData };
  } catch (error) {
    console.error("Error creating offline vote:", error);
    throw error;
  }
};

export const updateOfflineVote = async (voteId, voteData) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "votesOffline", voteId);
    await updateDoc(docRef, {
      ...voteData,
      updatedAt: new Date(),
    });
    return { id: voteId, ...voteData };
  } catch (error) {
    console.error("Error updating offline vote:", error);
    throw error;
  }
};

export const deleteOfflineVote = async (voteId) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "votesOffline", voteId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting offline vote:", error);
    throw error;
  }
};

export const getPengesahanOffline = async () => {
  try {
    const db = await getDb();
    const docRef = doc(db, "settings", "pengesahanOffline");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting pengesahan offline:", error);
    throw error;
  }
};

export const savePengesahanOffline = async (data) => {
  try {
    const db = await getDb();
    const docRef = doc(db, "settings", "pengesahanOffline");
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
    return data;
  } catch (error) {
    console.error("Error saving pengesahan offline:", error);
    throw error;
  }
};

export const deletePengesahanOffline = async () => {
  try {
    const db = await getDb();
    const docRef = doc(db, "settings", "pengesahanOffline");
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting pengesahan offline:", error);
    throw error;
  }
};

// Online Votes management functions
export const getAllOnlineVotes = async () => {
  try {
    const db = await getDb();
    const querySnapshot = await getDocs(collection(db, "suaraOnline"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting online votes:", error);
    return [];
  }
};

export const createOnlineVote = async (voteData) => {
  try {
    const db = await getDb();

    // Validate required fields
    if (!voteData.pemilihId || !voteData.calonId) {
      throw new Error("Missing required fields: pemilihId, calonId");
    }

    const docRef = await addDoc(collection(db, "suaraOnline"), {
      // Voter information
      pemilihId: voteData.pemilihId,
      namaPemilih: voteData.namaPemilih || null,
      nomorTelepon: voteData.nomorTelepon || null,
      wilayahId: voteData.wilayahId || null,
      wilayahNama: voteData.wilayahNama || null,

      // Candidate information
      calonId: voteData.calonId,
      nomorUrut: voteData.nomorUrut,
      calonNama: voteData.calonNama,
      namaKetua: voteData.namaKetua || voteData.calonNama,
      namaWakil: voteData.namaWakil || null,

      // Vote details
      statusSuara: voteData.statusSuara || "SAH",
      caraMemilih: "online",
      tipeRekaman: "suaraOnline",

      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date(),
      timestamp: voteData.timestamp || new Date().toISOString(),
    });

    return { id: docRef.id, ...voteData };
  } catch (error) {
    console.error("Error creating online vote:", error);
    throw error;
  }
};

// Reset data functions
export const resetAllData = async (resetType = "all") => {
  try {
    const db = await getDb();

    if (resetType === "all") {
      // Delete all collections
      const collections = [
        "settings",
        "calon",
        "wilayah",
        "pemilih",
        "votes",
        "votesOffline",
        "suaraOnline",
      ];
      for (const collName of collections) {
        const querySnapshot = await getDocs(collection(db, collName));
        for (const docSnap of querySnapshot.docs) {
          await deleteDoc(doc(db, collName, docSnap.id));
        }
      }
    } else if (resetType === "pemilih") {
      // Delete voters and votes
      const collections = ["pemilih", "votes", "votesOffline", "suaraOnline"];
      for (const collName of collections) {
        const querySnapshot = await getDocs(collection(db, collName));
        for (const docSnap of querySnapshot.docs) {
          await deleteDoc(doc(db, collName, docSnap.id));
        }
      }
    } else if (resetType === "hasil") {
      // Delete only votes
      const collections = ["votes", "votesOffline", "suaraOnline"];
      for (const collName of collections) {
        const querySnapshot = await getDocs(collection(db, collName));
        for (const docSnap of querySnapshot.docs) {
          await deleteDoc(doc(db, collName, docSnap.id));
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error resetting data:", error);
    throw error;
  }
};
