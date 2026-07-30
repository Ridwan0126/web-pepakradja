// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://rpp.bapenda.jatengprov.go.id/api',
  TIMEOUT: 30000,
}

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'PEPAK RAJA',
  APP_FULL_NAME: 'Pelayanan Pajak dan Retribusi Jawa Tengah Online',
  VERSION: '1.0.0',
  CONTACT_EMAIL: 'pepakraja@jatengprov.go.id',
  CONTACT_PHONE: '024-8311746',
  ADDRESS: 'Jl. Pemuda No. 1, Semarang, Jawa Tengah',
}

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'qris', name: 'QRIS', icon: 'qr-code', description: 'Bayar dengan scan QR' },
  { id: 'va_bca', name: 'VA BCA', icon: 'building', description: 'Virtual Account BCA' },
  { id: 'va_mandiri', name: 'VA Mandiri', icon: 'building', description: 'Virtual Account Mandiri' },
  { id: 'va_bni', name: 'VA BNI', icon: 'building', description: 'Virtual Account BNI' },
  { id: 'va_bri', name: 'VA BRI', icon: 'building', description: 'Virtual Account BRI' },
  { id: 'gopay', name: 'GoPay', icon: 'wallet', description: 'E-Wallet GoPay' },
  { id: 'ovo', name: 'OVO', icon: 'wallet', description: 'E-Wallet OVO' },
  { id: 'dana', name: 'DANA', icon: 'wallet', description: 'E-Wallet DANA' },
]

// Status Configuration
export const STATUS_CONFIG = {
  skrd: {
    pending: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Sudah Dibayar', color: 'bg-green-100 text-green-800' },
    expired: { label: 'Kadaluarsa', color: 'bg-red-100 text-red-800' },
    cancelled: { label: 'Dibatalkan', color: 'bg-gray-100 text-gray-800' },
  },
  transaction: {
    success: { label: 'Berhasil', color: 'bg-green-100 text-green-800' },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    failed: { label: 'Gagal', color: 'bg-red-100 text-red-800' },
  },
}

// Jenis Retribusi
export const JENIS_RETRIBUSI = [
  { id: 'all', label: 'Semua Jenis' },
  { id: 'wisata', label: 'Wisata' },
  { id: 'parkir', label: 'Parkir' },
  { id: 'pasar', label: 'Pasar' },
  { id: 'sewa', label: 'Sewa Aset' },
  { id: 'kesehatan', label: 'Kesehatan' },
  { id: 'perizinan', label: 'Perizinan' },
]

// Kabupaten/Kota Jawa Tengah
export const KABUPATEN_KOTA = [
  { id: 'all', label: 'Semua Wilayah' },
  { id: 'semarang_kota', label: 'Kota Semarang' },
  { id: 'semarang_kab', label: 'Kab. Semarang' },
  { id: 'solo', label: 'Kota Surakarta' },
  { id: 'magelang', label: 'Kota Magelang' },
  { id: 'salatiga', label: 'Kota Salatiga' },
  { id: 'pekalongan', label: 'Kota Pekalongan' },
  { id: 'tegal', label: 'Kota Tegal' },
  { id: 'banyumas', label: 'Kab. Banyumas' },
  { id: 'cilacap', label: 'Kab. Cilacap' },
  { id: 'purbalingga', label: 'Kab. Purbalingga' },
  { id: 'banjarnegara', label: 'Kab. Banjarnegara' },
  { id: 'kebumen', label: 'Kab. Kebumen' },
  { id: 'purworejo', label: 'Kab. Purworejo' },
  { id: 'wonosobo', label: 'Kab. Wonosobo' },
  { id: 'magelang_kab', label: 'Kab. Magelang' },
  { id: 'boyolali', label: 'Kab. Boyolali' },
  { id: 'klaten', label: 'Kab. Klaten' },
  { id: 'sukoharjo', label: 'Kab. Sukoharjo' },
  { id: 'wonogiri', label: 'Kab. Wonogiri' },
  { id: 'karanganyar', label: 'Kab. Karanganyar' },
  { id: 'sragen', label: 'Kab. Sragen' },
  { id: 'grobogan', label: 'Kab. Grobogan' },
  { id: 'blora', label: 'Kab. Blora' },
  { id: 'rembang', label: 'Kab. Rembang' },
  { id: 'pati', label: 'Kab. Pati' },
  { id: 'kudus', label: 'Kab. Kudus' },
  { id: 'jepara', label: 'Kab. Jepara' },
  { id: 'demak', label: 'Kab. Demak' },
  { id: 'kendal', label: 'Kab. Kendal' },
  { id: 'batang', label: 'Kab. Batang' },
  { id: 'pekalongan_kab', label: 'Kab. Pekalongan' },
  { id: 'pemalang', label: 'Kab. Pemalang' },
  { id: 'tegal_kab', label: 'Kab. Tegal' },
  { id: 'brebes', label: 'Kab. Brebes' },
  { id: 'temanggung', label: 'Kab. Temanggung' },
]
