import { useState } from 'react'
import { FileText, CreditCard, Ticket, Search } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TransactionAgreement from '../components/TransactionAgreement'
import TransactionDirectTicket from '../components/TransactionDirectTicket'
import PaymentStatus from '../components/PaymentStatus'

export default function Transactions() {
  const [activeTab, setActiveTab] = useState('agreement') // agreement, direct, ticket, status

  const tabs = [
    {
      id: 'agreement',
      label: 'Perjanjian',
      icon: FileText,
      description: 'Transaksi dengan Perjanjian Kerja Sama (PKS)',
    },
    {
      id: 'direct',
      label: 'Pembayaran Langsung',
      icon: CreditCard,
      description: 'Bayar retribusi secara langsung',
    },
    {
      id: 'ticket',
      label: 'Tiket',
      icon: Ticket,
      description: 'Transaksi dengan sistem tiket',
    },
    {
      id: 'status',
      label: 'Cek Status',
      icon: Search,
      description: 'Periksa status pembayaran Anda',
    },
  ]

  const TabIcon = tabs.find((t) => t.id === activeTab)?.icon || FileText

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12 animate-slide-in-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Sistem Pembayaran Retribusi</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Layanan pembayaran retribusi daerah yang transparan, aman, dan mudah digunakan
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group p-6 rounded-2xl border-2 transition-smooth text-left ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 text-white shadow-xl'
                    : 'bg-white border-gray-200 hover:border-blue-400 text-gray-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-3 rounded-lg ${
                      activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-blue-100 group-hover:bg-blue-200 transition-smooth'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-white' : 'text-blue-600'}`} />
                  </div>
                  {activeTab === tab.id && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">{tab.label}</h3>
                <p
                  className={`text-sm ${
                    activeTab === tab.id ? 'text-blue-100' : 'text-gray-600'
                  }`}
                >
                  {tab.description}
                </p>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {activeTab === 'agreement' && <TransactionAgreement />}
          {activeTab === 'direct' && <TransactionDirectTicket type="langsung" />}
          {activeTab === 'ticket' && <TransactionDirectTicket type="tiket" />}
          {activeTab === 'status' && <PaymentStatus />}
        </div>

        {/* Info Sections */}
        {activeTab !== 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center text-2xl mb-4">
                1️⃣
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Pilih Jenis Transaksi</h3>
              <p className="text-sm text-gray-600">
                Tentukan jenis transaksi yang sesuai dengan kebutuhan Anda
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center text-2xl mb-4">
                2️⃣
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Isi Data Dengan Lengkap</h3>
              <p className="text-sm text-gray-600">
                Lengkapi semua data yang diperlukan dengan akurat
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center text-2xl mb-4">
                3️⃣
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Pembayaran & Bukti</h3>
              <p className="text-sm text-gray-600">
                Scan QR dan bayar, kemudian unduh bukti pembayaran
              </p>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Pertanyaan Umum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Apa itu SKRD?</h3>
              <p className="text-sm text-gray-600">
                SKRD (Surat Ketetapan Retribusi Daerah) adalah dokumen resmi yang berisi jumlah retribusi yang harus dibayarkan
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Bagaimana cara pembayaran?</h3>
              <p className="text-sm text-gray-600">
                Anda dapat membayar melalui QRIS, transfer bank, atau datang langsung ke kantor retribusi
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Berapa lama proses verifikasi?</h3>
              <p className="text-sm text-gray-600">
                Proses verifikasi PKS biasanya memakan waktu 1-7 hari kerja setelah dokumen lengkap diterima
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Bagaimana jika sudah bayar?</h3>
              <p className="text-sm text-gray-600">
                Gunakan fitur "Cek Status" untuk memverifikasi pembayaran dan unduh Tanda Bukti Pembayaran (TBP)
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
