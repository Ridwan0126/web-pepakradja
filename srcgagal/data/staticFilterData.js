// Static filter data - TIDAK MENGGUNAKAN API
export const staticFilterData = {
  locations: [
    "KABUPATEN BANJARNEGARA",
    "KABUPATEN BANYUMAS",
    "KABUPATEN BATANG",
    "KABUPATEN BLORA",
    "KABUPATEN BOYOLALI",
    "KABUPATEN BREBES",
    "KABUPATEN CILACAP",
    "KABUPATEN DEMAK",
    "KABUPATEN GROBOGAN",
    "KABUPATEN JEPARA",
    "KABUPATEN KARANGANYAR",
    "KABUPATEN KEBUMEN",
    "KABUPATEN KENDAL",
    "KABUPATEN KLATEN",
    "KABUPATEN KUDUS",
    "KABUPATEN MAGELANG",
    "KABUPATEN PATI",
    "KABUPATEN PEKALONGAN",
    "KABUPATEN PEMALANG",
    "KABUPATEN PURBALINGGA",
    "KABUPATEN PURWOREJO",
    "KABUPATEN REMBANG",
    "KABUPATEN SEMARANG",
    "KABUPATEN SRAGEN",
    "KABUPATEN SUKOHARJO",
    "KABUPATEN TEGAL",
    "KABUPATEN TEMANGGUNG",
    "KABUPATEN WONOGIRI",
    "KABUPATEN WONOSOBO",
    "KOTA MAGELANG",
    "KOTA PEKALONGAN",
    "KOTA SALATIGA",
    "KOTA SEMARANG",
    "KOTA SURAKARTA",
    "KOTA TEGAL",
  ],

  opds: [
    "BADAN KEPEGAWAIAN DAERAH",
    "BADAN KESATUAN BANGSA DAN POLITIK",
    "BADAN PENANGGULANGAN BENCANA DAERAH",
    "BADAN PENDAPATAN DAERAH",
    "BADAN PERENCANAAN PEMBANGUNAN DAERAH",
    "DINAS BINA MARGA DAN PENATAAN RUANG",
    "DINAS DUKCAPIL",
    "DINAS KESEHATAN",
    "DINAS KETENAGAKERJAAN",
    "DINAS KOMUNIKASI DAN INFORMATIKA",
    "DINAS KOPERASI DAN UKM",
    "DINAS LINGKUNGAN HIDUP",
    "DINAS PARIWISATA DAN KEBUDAYAAN",
    "DINAS PEKERJAAN UMUM DAN PENATAAN RUANG",
    "DINAS PENANAMAN MODAL DAN PELAYANAN TERPADU SATU PINTU",
    "DINAS PERDAGANGAN",
    "DINAS PERIKANAN DAN KELAUTAN",
    "DINAS PERPUSTAKAAN DAN KEARSIPAN",
    "DINAS PERTANIAN DAN KETAHANAN PANGAN",
    "DINAS PETERNAKAN DAN KESEHATAN HEWAN",
    "DINAS SOSIAL",
    "DINAS TENAGA KERJA",
    "DINAS TRANSPORTASI",
    "INSPEKTORAT DAERAH",
    "RUMAH SAKIT UMUM DAERAH",
  ],

  jenisLayanan: [
    "Retribusi Jasa Umum",
    "Retribusi Jasa Usaha",
    "Retribusi Perizinan Tertentu",
    "Retribusi Pelayanan Kesehatan",
    "Retribusi Pelayanan Persampahan/Kebersihan",
    "Retribusi Penggantian Biaya Cetak Kartu Penduduk dan Akta Catatan Sipil",
    "Retribusi Pelayanan Parkir di Tepi Jalan Umum",
    "Retribusi Pelayanan Pasar",
    "Retribusi Pengujian Kendaraan Bermotor",
    "Retribusi Pemeriksaan Alat Pemadam Kebakaran",
    "Retribusi Penggantian Biaya Cetak Peta",
    "Retribusi Penyediaan dan/atau Penyedotan Kakus",
    "Retribusi Pengolahan Limbah Cair",
    "Retribusi Pelayanan Tera/Tera Ulang",
    "Retribusi Pelayanan Pendidikan",
    "Retribusi Pengendalian Menara Telekomunikasi",
  ],
}

// Helper functions untuk convert ke format dropdown
export const getLocationOptions = () => {
  return staticFilterData.locations.map((location) => ({
    value: location,
    label: location,
  }))
}

export const getOPDOptions = () => {
  return staticFilterData.opds.map((opd) => ({
    value: opd,
    label: opd,
  }))
}

export const getJenisLayananOptions = () => {
  return staticFilterData.jenisLayanan.map((jenis) => ({
    value: jenis,
    label: jenis,
  }))
}

// Default export
export default staticFilterData
