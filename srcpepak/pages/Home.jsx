import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Briefcase,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const features = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Transaksi Aman",
      description:
        "Semua transaksi dienkripsi dengan protokol keamanan standar industri terkini.",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Profesional Terverifikasi",
      description:
        "Terhubung dengan konsultan pajak dan ahli retribusi yang bersertifikat.",
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Proses Cepat",
      description:
        "Pengiriman layanan yang cepat dengan harga transparan tanpa biaya tersembunyi.",
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Terpercaya",
      description:
        "Dipercaya oleh ribuan pengusaha dan perusahaan di seluruh Indonesia.",
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Konsultasi Gratis",
      description:
        "Dapatkan konsultasi awal gratis sebelum memutuskan layanan apa yang Anda butuhkan.",
    },
    {
      icon: <Briefcase className="w-10 h-10" />,
      title: "Dukungan 24/7",
      description:
        "Tim dukungan pelanggan siap membantu Anda kapan saja, siang atau malam.",
    },
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Pemilik Bisnis",
      text: "PEPAK RAJA membantu saya mengelola dokumen pajak dengan efisien. Sangat direkomendasikan!",
      rating: 5,
    },
    {
      name: "Siti Rahman",
      role: "Akuntan",
      text: "Platform ini membuat saya mudah menemukan layanan konsultasi pajak yang andal.",
      rating: 5,
    },
    {
      name: "Ahmad Wijaya",
      role: "Pengusaha",
      text: "Marketplace yang luar biasa dengan layanan profesional. Akan menggunakan lagi!",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10K+", label: "Pengguna Aktif" },
    { number: "500+", label: "Profesional" },
    { number: "50K+", label: "Transaksi Sukses" },
    { number: "99%", label: "Kepuasan Pelanggan" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-14">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-in-down">
              <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                ✨ Solusi Terpercaya untuk Pajak & Retribusi
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Marketplace{" "}
                <span className="text-transparent bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text">
                  Pajak & Retribusi
                </span>{" "}
                Terdepan
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Terhubung dengan profesional bersertifikat untuk menangani
                kewajiban pajak dan layanan retribusi Anda dengan percaya diri
                dan kemudahan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-2xl transition-smooth transform hover:scale-105 active:scale-95"
                >
                  Jelajahi Layanan{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-smooth" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-smooth active:scale-95"
                >
                  Daftar Sekarang
                </Link>
              </div>
              {/* Trust badges */}
              <div className="mt-8 flex items-center gap-4 flex-wrap">
                {["Aman", "Terpercaya", "Cepat"].map((badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-slide-in-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-teal-400 to-green-600 opacity-90" />
                <div className="relative h-96 md:h-[500px] flex items-center justify-center">
                  <div className="text-center text-white">
                    <Briefcase className="w-24 h-24 mx-auto mb-4 opacity-80 animate-bounce-slow" />
                    <h3 className="text-2xl font-bold">Solusi Lengkap</h3>
                    <p className="text-green-100 mt-2">
                      Untuk Kebutuhan Pajak & Retribusi Anda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center text-white animate-scale-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
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
            Kami menyediakan solusi terpadu untuk semua kebutuhan pajak dan
            retribusi Anda dengan layanan terbaik dan harga kompetitif.
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
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
            Ribuan profesional dan pengusaha telah mempercayai PEPAK RAJA untuk
            kebutuhan pajak mereka.
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
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
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
          <h2 className="text-4xl font-bold text-white mb-4">
            Siap Untuk Memulai?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Bergabunglah dengan ribuan profesional yang telah mempercayai kami
            untuk mengelola kebutuhan pajak dan retribusi mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-smooth shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Lihat Katalog Lengkap
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-smooth transform hover:scale-105 active:scale-95"
            >
              Daftar Gratis Sekarang
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
