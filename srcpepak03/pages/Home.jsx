import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Users, Zap, Shield, TrendingUp, Award, Briefcase } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import QuickServices from '../components/QuickServices'
import ProductFilter from '../components/ProductFilter'
import ProductGrid from '../components/ProductGrid'
import SearchDropdown from '../components/SearchDropdown'

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const carouselSlides = [
    {
      badge: 'Promo Spesial',
      title: 'Konsultasi Pajak Gratis',
      description: 'Dapatkan konsultasi awal gratis dengan profesional bersertifikat kami untuk mengoptimalkan kewajiban pajak Anda.',
      cta: 'Konsultasi Sekarang',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      badge: 'Penawaran Terbatas',
      title: 'Proses Retribusi Cepat',
      description: 'Kelola semua kebutuhan retribusi Anda hanya dalam hitungan menit dengan platform kami yang user-friendly.',
      cta: 'Mulai Sekarang',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      badge: 'Terbaru',
      title: 'Pembayaran Digital Aman',
      description: 'Lakukan pembayaran retribusi dengan sistem keamanan terkini dan berbagai metode pembayaran yang tersedia.',
      cta: 'Pelajari Lebih Lanjut',
      gradient: 'from-indigo-500 to-blue-600',
    },
  ]

  const features = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: 'Transaksi Aman',
      description: 'Semua transaksi dienkripsi dengan protokol keamanan standar industri terkini.'
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: 'Profesional Terverifikasi',
      description: 'Terhubung dengan konsultan pajak dan ahli retribusi yang bersertifikat.',
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: 'Proses Cepat',
      description: 'Pengiriman layanan yang cepat dengan harga transparan tanpa biaya tersembunyi.',
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: 'Terpercaya',
      description: 'Dipercaya oleh ribuan pengusaha dan perusahaan di seluruh Indonesia.',
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: 'Konsultasi Gratis',
      description: 'Dapatkan konsultasi awal gratis sebelum memutuskan layanan apa yang Anda butuhkan.',
    },
    {
      icon: <Briefcase className="w-10 h-10" />,
      title: 'Dukungan 24/7',
      description: 'Tim dukungan pelanggan siap membantu Anda kapan saja, siang atau malam.',
    },
  ]

  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Pemilik Bisnis',
      text: 'PEPAK RAJA membantu saya mengelola dokumen pajak dengan efisien. Sangat direkomendasikan!',
      rating: 5,
    },
    {
      name: 'Siti Rahman',
      role: 'Akuntan',
      text: 'Platform ini membuat saya mudah menemukan layanan konsultasi pajak yang andal.',
      rating: 5,
    },
    {
      name: 'Ahmad Wijaya',
      role: 'Pengusaha',
      text: 'Marketplace yang luar biasa dengan layanan profesional. Akan menggunakan lagi!',
      rating: 5,
    },
  ]

  const stats = [
    { number: '10K+', label: 'Pengguna Aktif' },
    { number: '500+', label: 'Profesional' },
    { number: '50K+', label: 'Transaksi Sukses' },
    { number: '99%', label: 'Kepuasan Pelanggan' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      {/* Carousel Slider */}
      <section className="pt-32 md:pt-36 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <Carousel slides={carouselSlides} />
        </div>
      </section>

      {/* Products Section with 2-Column Layout */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 animate-slide-in-down">
              Jelajahi Produk & Layanan
            </h2>
            <p className="text-gray-600 text-lg animate-slide-in-down" style={{ animationDelay: '100ms' }}>
              Temukan semua kebutuhan pajak dan retribusi Anda di satu tempat
            </p>
          </div>

          {/* 2-Column Layout: Quick Services + Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Left Column: Quick Services */}
            <div className="lg:col-span-1">
              <QuickServices />
            </div>

            {/* Right Column: Filter */}
            <div className="lg:col-span-3">
              <ProductFilter
                onFilterChange={setFilters}
                onSearch={setSearchTerm}
              />
            </div>
          </div>

          {/* Product Grid - Full Width */}
          <ProductGrid filters={filters} searchTerm={searchTerm} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center text-white animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 animate-slide-in-down">
            Mengapa Pilih PEPAK RAJA?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Kami menyediakan solusi terpadu untuk semua kebutuhan pajak dan retribusi Anda dengan layanan terbaik dan harga kompetitif.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-green-200 card-hover animate-scale-in shadow-sm hover:shadow-xl"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="mb-4 inline-flex p-3 bg-gradient-to-br from-green-100 to-teal-100 text-green-600 rounded-lg group-hover:shadow-lg transition-smooth">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-4 w-12 h-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-full opacity-0 group-hover:opacity-100 transition-smooth" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 animate-slide-in-down">
            Apa Kata Pengguna Kami
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Ribuan profesional dan pengusaha telah mempercayai PEPAK RAJA untuk kebutuhan pajak mereka.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx} 
                className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-green-200 transition-smooth animate-slide-in-up card-hover"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 via-teal-500 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-slide-in-down">
          <h2 className="text-4xl font-bold text-white mb-4">Siap Untuk Memulai?</h2>
          <p className="text-xl text-green-100 mb-8">
            Bergabunglah dengan ribuan profesional yang telah mempercayai kami untuk mengelola kebutuhan pajak dan retribusi mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-smooth shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
              Lihat Katalog Lengkap
            </Link>
            <Link to="/register" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-smooth transform hover:scale-105 active:scale-95">
              Daftar Gratis Sekarang
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
