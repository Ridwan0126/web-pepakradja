const firebaseConfig = {
  apiKey: "AIzaSyCRtgEJgJef3PNkPxPxbilsFRsv7Ldrv5Q",
  authDomain: "retribusi-bapenda.firebaseapp.com",
  projectId: "retribusi-bapenda",
  storageBucket: "retribusi-bapenda.firebasestorage.app",
  messagingSenderId: "479725161202",
  appId: "1:479725161202:web:3980d3054259bd5a235e6b",
  measurementId: "G-TJL81KLS2Q"
};

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Search,
  Download,
  Printer,
  X,
  XCircle,
  Building2,
  MapPin,
  Landmark,
  Phone,
  Mail,
  User,
  ArrowRight,
  Wallet,
  Share2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Upload,
  History,
  Calendar,
  Eye,
  Save,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

// IMPORT FIREBASE SDK MODULAR (Firestore)
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SPTRD() {
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // KTP & FIRESTORE CHECK STATES
  const [hasKtp, setHasKtp] = useState(true);
  const [checkingKtp, setCheckingKtp] = useState(true);
  const [uploadingKtp, setUploadingKtp] = useState(false);
  const fileInputRef = useRef(null);

  // SEARCH STATES
  const searchRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [obyekList, setObyekList] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // DETAIL & PREVIEW STATES
  const [selectedObyek, setSelectedObyek] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isFromHistory, setIsFromHistory] = useState(false);

  // HISTORY STATES
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const session =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wr_session")) || {}
      : {};

  const wr = session?.user || {};

  // =========================
  // CEK KTP DI FIRESTORE
  // =========================
  useEffect(() => {
    const checkUserKtpInFirestore = async () => {
      if (!wr?.id && !wr?.npwrd && !wr?.nik_npwp) {
        setCheckingKtp(false);
        return;
      }

      try {
        const userId = wr?.id || wr?.npwrd || wr?.nik_npwp;
        const userDocRef = doc(db, "users", String(userId));
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData?.foto_ktp || userData?.ktp_base64) {
            setHasKtp(true);
          } else {
            setHasKtp(false);
          }
        } else {
          setHasKtp(false);
        }
      } catch (err) {
        console.error("Gagal mengecek KTP di Firestore:", err);
      } finally {
        setCheckingKtp(false);
      }
    };

    checkUserKtpInFirestore();
  }, [wr]);

  // =========================
  // HANDLE UPLOAD KTP KE FIRESTORE (BASE64)
  // =========================
  const handleUploadKtp = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Format Tidak Valid",
        text: "Harap unggah file berformat Foto (JPG/PNG) atau PDF.",
      });
      return;
    }

    if (file.size > 1048576) {
      Swal.fire({
        icon: "warning",
        title: "File Terlalu Besar",
        text: "Ukuran file maksimal adalah 1 MB agar dapat disimpan ke database Firestore. Harap kompres file Anda terlebih dahulu.",
      });
      return;
    }

    try {
      setUploadingKtp(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result;
        const userId = wr?.id || wr?.npwrd || wr?.nik_npwp;
        const userDocRef = doc(db, "users", String(userId));
        const userSnap = await getDoc(userDocRef);

        const payload = {
          nama: wr?.nama || "",
          npwrd: wr?.npwrd || "",
          nik: wr?.nik_npwp || "",
          foto_ktp: base64String,
          updated_at: new Date().toISOString(),
        };

        if (userSnap.exists()) {
          await updateDoc(userDocRef, payload);
        } else {
          payload.created_at = new Date().toISOString();
          await setDoc(userDocRef, payload);
        }

        setHasKtp(true);
        setUploadingKtp(false);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Anda telah upload dokumen data diri.",
          timer: 2000,
          showConfirmButton: false,
        });
      };

      reader.onerror = (error) => {
        console.error("Reader Error:", error);
        setUploadingKtp(false);
        Swal.fire({
          icon: "error",
          title: "Gagal Membaca File",
          text: "Terjadi kesalahan saat memproses file.",
        });
      };

    } catch (err) {
      console.error("Firestore Save Error:", err);
      setUploadingKtp(false);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Terjadi kesalahan saat menyimpan data KTP ke database.",
      });
    }
  };

  const rupiah = (val) => Number(val || 0).toLocaleString("id-ID");

  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  // =========================
  // AUTO SEARCH (DEBOUNCE 500ms)
  // =========================
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (keyword.trim()) {
        handleSearch(keyword, 1, false);
      } else {
        setObyekList([]);
        setSearchOpen(false);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [keyword]);

  const handleSearch = async (
    keywordSearch = keyword,
    pageNumber = 1,
    isLoadMore = false
  ) => {
    try {
      const queryVal = keywordSearch.toLowerCase().trim();
      if (!queryVal) return;

      if (!isLoadMore) {
        setLastSearch(keywordSearch);
        setLoadingSearch(true);
        setObyekList([]);
        setPage(1);
      } else {
        setIsFetchingMore(true);
      }

      setSearchOpen(true);

      const res = await fetch(
        `/bapenda/pepakraja/obyek?page=${pageNumber}&limit=20&search=${encodeURIComponent(queryVal)}`,
        {
          headers: {
            token: "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
            Accept: "application/json",
          },
        }
      );

      const result = await res.json();
      const apiData = result?.data || [];

      setHasMore(apiData.length === 20);

      if (isLoadMore) {
        setObyekList((prev) => [...prev, ...apiData]);
      } else {
        setObyekList(apiData);
      }
    } catch (err) {
      console.error("SEARCH ERROR:", err);
    } finally {
      setLoadingSearch(false);
      setIsFetchingMore(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(lastSearch, nextPage, true);
  };

  const getAllPhotos = (item) => {
    const photos = [];
    if (item?.foto) photos.push(item.foto);
    if (item?.foto_2) photos.push(item.foto_2);
    if (item?.foto_3) photos.push(item.foto_3);
    if (item?.foto_4) photos.push(item.foto_4);
    return photos.filter(Boolean).map((p) =>
      p.startsWith("http")
        ? p
        : `https://rpp.bapenda.jatengprov.go.id/penatausahaan/storage/${p}`
    );
  };

  const handlePreviewSPTRD = async (targetObyek) => {
    if (!targetObyek) return;

    if (targetObyek?.is_laku) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Obyek retribusi ini sudah disewa/digunakan.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (!wr?.nama) {
      Swal.fire({
        icon: "warning",
        title: "Belum Login",
        text: "Silakan login terlebih dahulu untuk membuat SPTRD.",
        confirmButtonText: "Login",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!hasKtp) {
      Swal.fire({
        icon: "warning",
        title: "Data Diri Belum Lengkap",
        text: "Anda belum mengunggah foto KTP. Silakan lengkapi terlebih dahulu.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Minta input volume terlebih dahulu via SweetAlert2
    const { value: inputVolume, dismiss } = await Swal.fire({
      title: "Masukkan Volume",
      text: "Masukkan jumlah/volume untuk pengajuan retribusi ini:",
      input: "number",
      inputAttributes: {
        min: 1,
        step: 1,
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Lanjutkan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
    });

    if (dismiss === Swal.DismissReason.cancel || !inputVolume) {
      return;
    }

    const volume = parseFloat(inputVolume) || 1;
    const tarif = Number(targetObyek?.tariftbl?.tarif || 0);
    const nilaiRetribusi = volume * tarif;

    // Ambil data KTP dari Firestore untuk ditampilkan di Lembar 2
    let ktpDataUrl = "";
    try {
      const userId = wr?.id || wr?.npwrd || wr?.nik_npwp;
      const userDocRef = doc(db, "users", String(userId));
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        ktpDataUrl = userSnap.data()?.foto_ktp || "";
      }
    } catch (err) {
      console.error("Gagal mengambil data KTP untuk lampiran:", err);
    }

    const newFormData = {
      nomor: `SPTRD-${Date.now()}`,
      tanggal: formatDate(new Date()),
      timestamp: new Date().toISOString(),
      userId: String(wr?.id || wr?.npwrd || wr?.nik_npwp),
      nama: wr?.nama || "-",
      alamat: wr?.alamat || "-",
      nik: wr?.nik_npwp || "-",
      npwrd: wr?.npwrd || "-",
      telepon: wr?.telepon || "-",
      email: wr?.email || "-",
      jenis: targetObyek?.golongan?.golongan || "Jasa",
      rincian: targetObyek?.obyek_retribusi || "Sewa",
      pelayanan:
        targetObyek?.jenis?.jenis_retribusi ||
        targetObyek?.tariftbl?.penerimaan ||
        "-",
      obyek: targetObyek?.obyek_retribusi || "-",
      lokasi: targetObyek?.alamat || "-",
      keterangan: targetObyek?.keterangan || "-",
      opd: targetObyek?.opd?.nama || "-",
      uppd: targetObyek?.uppd?.nama || "-",
      tarif: tarif,
      volume: volume,
      satuan: targetObyek?.tariftbl?.satuan?.satuan || "-",
      nilaiRetribusi: nilaiRetribusi,
      kota: targetObyek?.kota?.kab_kota || "JAWA TENGAH",
      ktpUrl: ktpDataUrl,
      qr: JSON.stringify({
        wr: wr?.npwrd,
        obyek: targetObyek?.id,
      }),
      idgen: targetObyek?.id_gen_obyek,
    };

    setFormData(newFormData);
    setIsFromHistory(false);
    setShowPreviewModal(true);
  };

  // =========================
  // HANDLE SIMPAN KE FIREBASE DENGAN KONFIRMASI
  // =========================
  const handleSaveToFirebase = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi Permohonan",
      text: "Apakah anda yakin ingin membuat permohonan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
    });

    if (confirmResult.isDismissed) {
      const cancelResult = await Swal.fire({
        title: "Batalkan Permohonan",
        text: "Apakah anda yakin ingin membatalkan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (cancelResult.isConfirmed) {
        Swal.fire({
          icon: "info",
          title: "Dibatalkan",
          text: "Permohonan dibatalkan.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      return;
    }

    if (confirmResult.isConfirmed) {
      try {
        await addDoc(collection(db, "sptrd_history"), formData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Permohonan SPTRD berhasil disimpan.",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowPreviewModal(false);
      } catch (err) {
        console.error("Gagal menyimpan history SPTRD ke Firebase:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menyimpan permohonan ke database.",
        });
      }
    }
  };

  // =========================
  // FETCH HISTORY DARI FIRESTORE
  // =========================
  const handleOpenHistory = async () => {
    if (!wr?.nama) {
      Swal.fire({
        icon: "warning",
        title: "Belum Login",
        text: "Silakan login terlebih dahulu untuk melihat riwayat SPTRD.",
      });
      return;
    }

    setShowHistoryModal(true);
    setLoadingHistory(true);

    try {
      const userId = String(wr?.id || wr?.npwrd || wr?.nik_npwp);
      const q = query(
        collection(db, "sptrd_history"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

      setHistoryList(list);
    } catch (err) {
      console.error("Gagal memuat history:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat memuat riwayat SPTRD.",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("sptrd-document");

    html2pdf()
      .set({
        margin: 0,
        filename: `SPTRD-${formData.nomor}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: [330, 210], orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans antialiased tracking-tight">
      <Header />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        {/* INFO & TOMBOL HISTORY */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Surat Pemberitahuan Retribusi Daerah (SPTRD)
            </h1>
            <p className="opacity-90">
              Cari / tentukan obyek / layanan terlebih dahulu untuk mengajukan permohonan / SPTRD.
            </p>
          </div>
          <button
            onClick={handleOpenHistory}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border border-white/30 shadow-lg backdrop-blur-md"
          >
            <History size={20} /> Riwayat SPTRD
          </button>
        </div>

        {/* NOTIFIKASI STATUS KTP */}
        {!checkingKtp && (
          <div className={`border-l-4 rounded-2xl p-6 shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${hasKtp ? "bg-green-50 border-green-500" : "bg-amber-50 border-amber-500"}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${hasKtp ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                {hasKtp ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <h3 className={`font-bold text-base ${hasKtp ? "text-green-900" : "text-amber-900"}`}>
                  {hasKtp ? "Informasi: Dokumen Data Diri Lengkap" : "Peringatan: Data Diri Belum Lengkap"}
                </h3>
                <p className={`text-sm ${hasKtp ? "text-green-700" : "text-amber-700"}`}>
                  {hasKtp ? "Anda telah upload dokumen data diri. Dokumen KTP siap dilampirkan pada permohonan." : "Anda belum melakukan upload data diri (Foto/PDF KTP). Segera lengkapi untuk dapat mengajukan SPTRD."}
                </p>
              </div>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadKtp}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingKtp}
                className={`${hasKtp ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"} text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50`}
              >
                <Upload size={16} />
                {uploadingKtp ? "Menyimpan..." : hasKtp ? "Perbarui KTP" : "Upload KTP"}
              </button>
            </div>
          </div>
        )}

        {/* SEARCH BAR SECTION */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 relative">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(keyword, 1, false)}
                placeholder="Cari nama obyek retribusi atau alamat..."
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {keyword && (
                <button
                  onClick={() => {
                    setKeyword("");
                    setObyekList([]);
                    setSearchOpen(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleSearch(keyword, 1, false)}
              disabled={loadingSearch}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Search size={18} />
              {loadingSearch ? "Memuat..." : "Cari Objek"}
            </button>
          </div>
        </div>

        {/* SECTION HASIL PENCARIAN */}
        {searchOpen && keyword.trim() && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-slate-900">
                Hasil Pencarian Objek Retribusi
              </h2>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {obyekList.length} Data Ditemukan
              </span>
            </div>

            {loadingSearch ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 shadow-md">
                Sedang mencari data objek retribusi...
              </div>
            ) : obyekList.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 shadow-md">
                Tidak ada objek retribusi yang cocok dengan kata kunci "{keyword}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {obyekList.map((item, index) => {
                  const photos = getAllPhotos(item);
                  const mainPhoto = photos[0] || "/images/logopepakraja.png";
                  return (
                    <motion.div
                      key={`${item.id}-${index}`}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        setSelectedObyek(item);
                        setActiveImage(0);
                        setShowDetailModal(true);
                      }}
                      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={mainPhoto}
                          alt={item.obyek_retribusi}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {item.is_laku ? (
                            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                              Tersewa
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              Tersedia
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-blue-600 font-bold uppercase mb-1">
                            {item?.opd?.nama || "-"}
                          </p>
                          <h3 className="font-bold text-slate-900 text-base line-clamp-2 mb-2">
                            {item.obyek_retribusi}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{item.alamat || "-"}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Tarif</span>
                            <span className="text-sm font-bold text-green-600">
                              Rp {rupiah(item?.tariftbl?.tarif)} / {item?.tariftbl?.satuan?.satuan || "Unit"}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={isFetchingMore}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
                >
                  {isFetchingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* DETAIL MODAL OBYEK */}
        {showDetailModal && selectedObyek && (() => {
          const images = getAllPhotos(selectedObyek);
          const finalImages = images.length > 0 ? images : ["/images/logopepakraja.png"];
          
          let lat = null;
          let lng = null;
          if (typeof selectedObyek?.lat_long === "string" && selectedObyek.lat_long.includes(",")) {
            const split = selectedObyek.lat_long.split(",").map((v) => v.trim());
            lat = parseFloat(split[0]);
            lng = parseFloat(split[1]);
          }

          return (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900">Detail Lengkap Obyek Retribusi</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* SLIDER GAMBAR */}
                  <div className="relative w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden bg-slate-900 group">
                    {finalImages.length > 1 && (
                      <>
                        {activeImage > 0 && (
                          <button
                            onClick={() => setActiveImage((prev) => prev - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/50 text-white rounded-full hover:bg-black/75 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        )}
                        {activeImage < finalImages.length - 1 && (
                          <button
                            onClick={() => setActiveImage((prev) => prev + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/50 text-white rounded-full hover:bg-black/75 transition-all"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    )}
                    <img
                      src={finalImages[activeImage]}
                      alt="Detail Obyek"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h1 className="text-xl md:text-2xl font-bold text-white">
                        {selectedObyek.obyek_retribusi}
                      </h1>
                    </div>
                  </div>

                  {/* THUMBNAILS */}
                  {finalImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {finalImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                            activeImage === idx ? "border-blue-600 scale-105" : "border-transparent opacity-60"
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* INFO GRID */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                      <h3 className="font-bold text-slate-800 text-base border-b pb-2">Informasi Umum</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">ID Barang / Jasa</p>
                          <p className="font-semibold text-slate-800">{selectedObyek.id_gen_obyek}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Jenis Retribusi</p>
                          <p className="font-semibold text-slate-800">{selectedObyek?.jenis?.jenis_retribusi || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Keterangan / Judul Penawaran</p>
                          <p className="font-semibold text-slate-800">{selectedObyek.keterangan || selectedObyek.judul_penawaran || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Status Ketersediaan</p>
                          <div className="flex gap-2 mt-1">
                            {selectedObyek.is_laku ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Tersewa</span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Tersedia</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                      <h3 className="font-bold text-slate-800 text-base border-b pb-2">Tarif & Lokasi</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Tarif Retribusi</p>
                          <p className="font-bold text-green-600 text-lg">
                            Rp {rupiah(selectedObyek?.tariftbl?.tarif)} <span className="text-xs font-normal text-slate-600">/ {selectedObyek?.tariftbl?.satuan?.satuan || "-"}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Alamat Lokasi</p>
                          <p className="font-semibold text-slate-800">{selectedObyek.alamat || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Wilayah</p>
                          <p className="font-semibold text-slate-800">
                            Kec. {selectedObyek?.kecamatan?.kecamatan || "-"}, Kab/Kota {selectedObyek?.kota?.kab_kota || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INSTANSI PENGELOLA */}
                  <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100">
                    <h3 className="font-bold text-slate-800 text-base mb-3">Instansi Pengelola</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">OPD</p>
                        <p className="font-semibold text-slate-800">{selectedObyek?.opd?.nama || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">UPPD / Balai</p>
                        <p className="font-semibold text-slate-800">{selectedObyek?.uppd?.nama || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Kontak Pengelola</p>
                        <p className="font-semibold text-green-600">{selectedObyek?.no_wa_pengelola || selectedObyek?.no_telp_pengelola || "-"}</p>
                      </div>
                    </div>
                  </div>

                  {/* GOOGLE MAPS */}
                  {lat && lng && (
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" /> Lokasi Peta
                      </h3>
                      <iframe
                        src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                        className="w-full h-56 rounded-xl border"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 z-20 border-t p-5 bg-white flex justify-end gap-3 shadow-lg">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-xl text-sm font-semibold transition-all"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handlePreviewSPTRD(selectedObyek);
                    }}
                    disabled={selectedObyek?.is_laku}
                    className={`px-8 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center gap-2 ${
                      selectedObyek?.is_laku
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-teal-500 hover:scale-105"
                    }`}
                  >
                    {selectedObyek?.is_laku ? "Obyek Tersewa" : "Buat SPTRD Sekarang"} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* MODAL RIWAYAT (HISTORY) CARD LIST */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <History className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Riwayat Pengajuan SPTRD</h2>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {loadingHistory ? (
                  <div className="text-center py-12 text-slate-500">Memuat riwayat pengajuan...</div>
                ) : historyList.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <FileText size={48} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold">Belum ada riwayat pengajuan SPTRD.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {historyList.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="bg-slate-50 border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                              {item.nomor}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Calendar size={12} /> {item.tanggal}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{item.obyek}</h3>
                          <p className="text-xs text-slate-600">
                            Volume: <span className="font-semibold text-slate-800">{item.volume} {item.satuan}</span> | Total Retribusi: <span className="font-semibold text-green-600">Rp {rupiah(item.nilaiRetribusi)}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setFormData(item);
                            setIsFromHistory(true);
                            setShowHistoryModal(false);
                            setShowPreviewModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm flex-shrink-0"
                        >
                          <Eye size={16} /> Lihat Preview
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 z-20 border-t p-4 bg-white flex justify-end">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-xl text-sm font-semibold transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PREVIEW SPTRD (DENGAN 2 LEMBAR) */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto">
            <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg p-4 flex justify-center gap-3 print:hidden">
              {!isFromHistory && (
                <button onClick={handleSaveToFirebase} className="btn-action bg-emerald-600 hover:bg-emerald-700">
                  <Save size={18} /> Simpan
                </button>
              )}
              <button onClick={handleDownloadPDF} className="btn-action bg-blue-700">
                <Download size={18} /> Download PDF
              </button>
              <button onClick={handlePrint} className="btn-action bg-gray-700">
                <Printer size={18} /> Print
              </button>
              <button onClick={() => setShowPreviewModal(false)} className="btn-action bg-red-600">
                <X size={18} /> Tutup
              </button>
            </div>

            <div className="flex flex-col items-center py-10 gap-10 print:p-0 print:gap-0">
              
              {/* LEMBAR 1: SURAT PERMOHONAN SPTRD */}
              <div id="sptrd-document" className="sptrd-paper-jtg">
                <div className="header-jtg">
                  <img
                    src="/images/logo-jateng-official.png"
                    alt="logo"
                    className="logo-jtg"
                  />
                  <div className="header-center">
                    <h2>PEMERINTAH PROVINSI JAWA TENGAH</h2>
                    <h3>{formData.opd}</h3>
                    <div>{formData.uppd}</div>
                  </div>
                </div>

                <div className="header-line"></div>

                <h1 className="title-jtg">
                  SURAT PEMBERITAHUAN RETRIBUSI DAERAH (SPTRD)
                </h1>

                <div className="tujuan-box">
                  <p>Kepada Yth:</p>
                  <p>Kepala {formData.opd}</p>
                  <p>Di</p>
                  <p>TEMPAT</p>
                </div>

                <p className="intro-text">Yang bertanda tangan dibawah ini, kami:</p>

                <div className="section-jtg">
                  <div className="section-title-jtg">I. Identitas Wajib Retribusi :</div>
                  <table className="table-jtg">
                    <tbody>
                      <tr><td>Nama</td><td>:</td><td>{formData.nama}</td></tr>
                      <tr><td>Alamat</td><td>:</td><td>{formData.alamat}</td></tr>
                      <tr><td>Nomor Induk Kependudukan</td><td>:</td><td>{formData.nik}</td></tr>
                      <tr><td>Nomor Induk Berusaha</td><td>:</td><td>{formData.npwrd}</td></tr>
                      <tr><td>Nomor Telepon</td><td>:</td><td>{formData.telepon}</td></tr>
                      <tr><td>Alamat Surat Elektronik</td><td>:</td><td>{formData.email}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="section-jtg">
                  <div className="section-title-jtg">II. Pelayanan Retribusi yang dimohon:</div>
                  <table className="table-jtg">
                    <tbody>
                      <tr><td>Jenis Retribusi</td><td>:</td><td>{formData.jenis}</td></tr>
                      <tr><td>Objek Retribusi</td><td>:</td><td>{formData.pelayanan}</td></tr>
                      <tr><td>Rincian Objek Retribusi</td><td>:</td><td>{formData.obyek} ( {formData.idgen} )</td></tr>
                      <tr><td>Uraian Deskripsi / Volume</td><td>:</td><td>{formData.keterangan}</td></tr>
                      <tr><td>Lokasi</td><td>:</td><td>{formData.lokasi}</td></tr>
                      <tr><td>Tarif</td><td>:</td><td>Rp {rupiah(formData.tarif)} / {formData.satuan}</td></tr>
                      <tr><td>Nilai Retribusi</td><td>:</td><td><strong>Rp {rupiah(formData.nilaiRetribusi)}</strong> ({formData.volume} × Rp {rupiah(formData.tarif)})</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="section-jtg">
                  <div className="section-title-jtg">III. Jangka waktu Retribusi :</div>
                  <div className="lampiran-jtg">
                    <p>Sebagai bahan pertimbangan, berikut kami lampirkan :</p>
                    <p>a. Fotokopi KTP;</p>
                    <p>b. Fotokopi NIB bagi Wajib Retribusi Badan Usaha;</p>
                    <p>c. Surat Kuasa bagi Wajib Retribusi yang tidak menandatangani SPTRD sendiri.</p>
                  </div>
                </div>

                <div className="pernyataan-jtg">
                  <p>
                    Apabila permohonan dikabulkan kami sanggup membayar Retribusi serta menanggung sanksi administratif atas keterlambatan pembayaran Retribusi sesuai ketentuan peraturan perundang-undangan yang berlaku atas kuasa saya.
                  </p>
                  <p>
                    Saya menyatakan bahwa yang kami beritahukan tersebut beserta lampirannya benar, lengkap dan jelas.
                  </p>
                </div>

                <div className="signature-jtg">
                  <div></div>
                  <div className="signature-right">
                    <p>{formData.alamat}, {formData.tanggal}</p>
                    <p>Wajib Retribusi / Kuasa</p>
                    <div className="ttd-space-jtg"></div>
                    <p>.........................................</p>
                  </div>
                </div>

                <div className="footer-note">
                  <span>*Coret yang tidak perlu</span>
                </div>
              </div>

              {/* LEMBAR 2: LAMPIRAN FOTO/PDF KTP */}
              <div className="sptrd-paper-jtg page-break-before">
                <div className="text-center mb-6 border-b pb-4">
                  <h2 className="text-lg font-bold">LAMPIRAN DOKUMEN IDENTITAS (KTP)</h2>
                  <p className="text-xs text-gray-600">Wajib Retribusi: {formData.nama} ({formData.nik})</p>
                </div>

                <div className="flex flex-col items-center justify-center h-[80%]">
                  {formData.ktpUrl ? (
                    formData.ktpUrl.startsWith("data:application/pdf") ? (
                      <div className="w-full h-full flex flex-col items-center justify-center border rounded-xl p-4 bg-gray-50">
                        <FileText size={64} className="text-blue-600 mb-2" />
                        <p className="font-semibold text-sm">Dokumen KTP berformat PDF</p>
                        <a 
                          href={formData.ktpUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                        >
                          Buka / Unduh File PDF
                        </a>
                      </div>
                    ) : (
                      <div className="max-w-full max-h-[700px] border rounded-xl overflow-hidden shadow-md bg-white p-2">
                        <img 
                          src={formData.ktpUrl} 
                          alt="Lampiran KTP" 
                          className="max-w-full max-h-[650px] object-contain mx-auto" 
                        />
                      </div>
                    )
                  ) : (
                    <p className="text-gray-500 italic">Tidak ada dokumen KTP yang ditemukan.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      <Footer />

      <style jsx>{`
        .btn-action {
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .sptrd-paper-jtg {
          width: 210mm;
          min-height: 297mm;
          background: white;
          padding: 18mm;
          font-family: "Times New Roman", serif;
          font-size: 12px;
          color: #000;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .page-break-before {
          page-break-before: always;
        }
        .header-jtg {
          display: flex;
          align-items: flex-start;
        }
        .logo-jtg {
          width: 70px;
          margin-right: 15px;
        }
        .header-center {
          flex: 1;
          text-align: center;
        }
        .header-center h2 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }
        .header-center h3 {
          margin: 3px 0;
          font-size: 15px;
        }
        .header-line {
          border-bottom: 4px solid #000;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .title-jtg {
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 25px;
        }
        .tujuan-box {
          width: 250px;
          margin-left: auto;
          text-align: left;
          margin-bottom: 20px;
        }
        .tujuan-box p {
          margin: 2px 0;
        }
        .intro-text {
          margin-bottom: 12px;
        }
        .section-jtg {
          margin-bottom: 15px;
        }
        .section-title-jtg {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .table-jtg {
          width: 100%;
          border-collapse: collapse;
        }
        .table-jtg td {
          padding: 2px 0;
          vertical-align: top;
        }
        .table-jtg td:first-child {
          width: 220px;
        }
        .table-jtg td:nth-child(2) {
          width: 20px;
        }
        .lampiran-jtg p {
          margin: 3px 0;
        }
        .pernyataan-jtg {
          text-align: justify;
          margin-top: 15px;
          line-height: 1.5;
        }
        .signature-jtg {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .signature-right {
          text-align: left;
          width: 250px;
        }
        .ttd-space-jtg {
          height: 50px;
        }
        .footer-note {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #sptrd-document,
          #sptrd-document *,
          .sptrd-paper-jtg {
            visibility: visible;
          }
          .sptrd-paper-jtg {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            box-shadow: none;
            page-break-after: always;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}