// Mock data untuk filter options - Static data yang tidak perlu API call
export const mockFilterOptions = {
  // Lokasi berdasarkan 35 kabupaten/kota di Jawa Tengah
  locations: [
    "Kabupaten Banjarnegara",
    "Kabupaten Banyumas",
    "Kabupaten Batang",
    "Kabupaten Blora",
    "Kabupaten Boyolali",
    "Kabupaten Brebes",
    "Kabupaten Cilacap",
    "Kabupaten Demak",
    "Kabupaten Grobongan",
    "Kabupaten Jepara",
    "Kabupaten Karanganyar",
    "Kabupaten Kebumen",
    "Kabupaten Kendal",
    "Kabupaten Klaten",
    "Kabupaten Kudus",
    "Kabupaten Magelang",
    "Kabupaten Pati",
    "Kabupaten Pekalongan",
    "Kabupaten Pemalang",
    "Kabupaten Purbalingga",
    "Kabupaten Purworejo",
    "Kabupaten Rembang",
    "Kabupaten Semarang",
    "Kabupaten Sragen",
    "Kabupaten Sukoharjo",
    "Kabupaten Tegal",
    "Kabupaten Temanggung",
    "Kabupaten Wonogiri",
    "Kabupaten Wonosobo",
    "Kota Magelang",
    "Kota Pekalongan",
    "Kota Salatiga",
    "Kota Semarang",
    "Kota Surakarta",
    "Kota Tegal",
  ],

  // OPD berdasarkan struktur pemerintahan Jawa Tengah
  opds: [
    "Sekretariat DPRD",
    "Inspektorat",
    "Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah",
    "Badan Pengelola Pendapatan Daerah",
    "Badan Pengelola Keuangan dan Aset Daerah",
    "Badan Kepegawaian Daerah",
    "Badan Pengembangan Sumber Daya Manusia Daerah",
    "Badan Penghubung",
    "Badan Penanggulangan Bencana Daerah",
    "Badan Kesatuan Bangsa dan Politik",
    "Dinas Pendidikan dan Kebudayaan",
    "Dinas Kesehatan",
    "Dinas Pekerjaan Umum Bina Marga dan Cipta Karya",
    "Dinas Pekerjaan Umum Sumber Daya Air dan Penataan Ruang",
    "Dinas Perumahan Rakyat dan Kawasan Permukiman",
    "Dinas Sosial",
    "Dinas Tenaga Kerja dan Transmigrasi",
    "Dinas Pemberdayaan Perempuan, Perlindungan Anak, Pengendalian Penduduk dan Keluarga Berencana",
    "Dinas Ketahanan Pangan",
    "Dinas Lingkungan Hidup dan Kehutanan",
    "Dinas Pemberdayaan Masyarakat, Desa, Kependudukan dan Pencatatan Sipil",
    "Dinas Perhubungan",
    "Dinas Komunikasi dan Informatika",
    "Dinas Koperasi, Usaha Kecil dan Menengah",
    "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu",
    "Dinas Kepemudaan, Olah Raga dan Pariwisata",
    "Dinas Kearsipan dan Perpustakaan",
    "Dinas Kelautan dan Perikanan",
    "Dinas Pertanian dan Perkebunan",
    "Dinas Peternakan dan Kesehatan Hewan",
    "Dinas Energi dan Sumber Daya Mineral",
    "Dinas Perindustrian dan Perdagangan",
    "Satuan Polisi Pamong Praja",
    "Biro Pemerintahan, Otonomi Daerah dan Kerjasama",
    "Biro Hukum",
    "Biro Kesejahteraan Rakyat",
    "Biro Administrasi Pembangunan Daerah",
    "Biro Administrasi Pengadaan Barang/Jasa",
    "Biro Infrastruktur dan Sumber Daya Alam",
    "Biro Perekonomian",
    "Biro Organisasi",
    "Biro Umum",
    "Rumah Sakit Umum Daerah MOEWARDI",
    "Rumah Sakit Umum Daerah Prof. Dr. MARGONO SOEKARJO",
    "Rumah Sakit Umum Daerah dr. ADHYATMA, MPH",
    "Rumah Sakit Umum Daerah Dr. REHATTA",
    "Rumah Sakit Jiwa Daerah Dr. AMINO GONDO HUTOMO",
    "Rumah Sakit Jiwa Daerah Dr. ARIF ZAINUDIN",
    "Rumah Sakit Jiwa Daerah Dr. RM. SOEDJARWADI",
  ],

  // Jenis Retribusi berdasarkan peraturan daerah
  jenisRetribusi: [
    "Retribusi Jasa Umum",
    "Retribusi Jasa Usaha",
    "Retribusi Perizinan Tertentu",
    "Retribusi Pelayanan Kesehatan",
    "Retribusi Pelayanan Kebersihan",
    "Retribusi Penyediaan Tempat Kegiatan Usaha",
    "Retribusi Penyediaan Tempat Pelelangan",
    "Retribusi Penyediaan Tempat Parkir",
    "Retribusi Penyediaan Tempat Penginapan",
    "Retribusi Pelayanan Kepelabuhanan",
    "Retribusi Tempat Rekreasi dan Pariwisata",
    "Retribusi Penjualan Hasil Produksi Usaha Daerah",
    "Retribusi Pemanfaatan Aset Daerah",
    "Retribusi Penggunaan Tenaga Kerja Asing",
    "Retribusi Pengelolaan Pertambangan Rakyat",
  ],

  // Jenis Layanan/Jasa (sama dengan jenis retribusi untuk saat ini)
  jenisLayanan: [
    "Retribusi Jasa Umum",
    "Retribusi Jasa Usaha",
    "Retribusi Perizinan Tertentu",
    "Retribusi Pelayanan Kesehatan",
    "Retribusi Pelayanan Kebersihan",
    "Retribusi Penyediaan Tempat Kegiatan Usaha",
    "Retribusi Penyediaan Tempat Pelelangan",
    "Retribusi Penyediaan Tempat Parkir",
    "Retribusi Penyediaan Tempat Penginapan",
    "Retribusi Pelayanan Kepelabuhanan",
    "Retribusi Tempat Rekreasi dan Pariwisata",
    "Retribusi Penjualan Hasil Produksi Usaha Daerah",
    "Retribusi Pemanfaatan Aset Daerah",
    "Retribusi Penggunaan Tenaga Kerja Asing",
    "Retribusi Pengelolaan Pertambangan Rakyat",
  ],
}

// Helper functions untuk mendapatkan filter options
export const getLocationOptions = () => {
  return mockFilterOptions.locations.map((location) => ({
    value: location,
    label: location,
  }))
}

export const getOPDOptions = () => {
  return mockFilterOptions.opds.map((opd) => ({
    value: opd,
    label: opd,
  }))
}

export const getJenisRetribusiOptions = () => {
  return mockFilterOptions.jenisRetribusi.map((jenis) => ({
    value: jenis,
    label: jenis,
  }))
}

export const getJenisLayananOptions = () => {
  return mockFilterOptions.jenisLayanan.map((layanan) => ({
    value: layanan,
    label: layanan,
  }))
}
