"use client"
import { motion } from "framer-motion"
import { Shield, Users, Target, Award, Mail, Phone, MapPin, Globe } from "lucide-react"

const AboutUsPage = () => {
  const features = [
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Sistem keamanan berlapis dengan enkripsi data tingkat tinggi untuk melindungi informasi Anda.",
    },
    {
      icon: Users,
      title: "Mudah Digunakan",
      description: "Interface yang intuitif dan user-friendly memudahkan semua kalangan dalam menggunakan platform.",
    },
    {
      icon: Target,
      title: "Akurat & Terpercaya",
      description: "Data yang akurat dan sistem yang dapat diandalkan untuk kebutuhan retribusi daerah.",
    },
    {
      icon: Award,
      title: "Standar Pemerintah",
      description: "Mengikuti standar dan regulasi pemerintah untuk sistem informasi pajak dan retribusi daerah.",
    },
  ]

  const team = [
    {
      name: "Drs. Ahmad Wijaya, M.Si",
      position: "Kepala Bidang Retribusi Daerah",
      image: "/government-official.png",
    },
    {
      name: "Sri Wahyuni, S.E",
      position: "Petugas Verifikasi",
      image: "/female-government-officer.png",
    },
    {
      name: "Budi Santoso, S.Kom",
      position: "Administrator Sistem",
      image: "/male-it-officer.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tentang Penak Busiti Jane</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem Informasi Pajak dan Retribusi Daerah Jawa Tengah yang modern, mudah, cepat, dan terpercaya untuk
            melayani masyarakat dengan lebih baik.
          </p>
        </motion.div>

        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Visi & Misi</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">Visi</h3>
                <p className="text-gray-700 leading-relaxed">
                  Menjadi sistem informasi pajak dan retribusi daerah yang terdepan, inovatif, dan terpercaya dalam
                  mendukung pembangunan daerah Jawa Tengah yang berkelanjutan.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">Misi</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    Memberikan pelayanan pajak dan retribusi daerah yang mudah, cepat, dan transparan
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    Meningkatkan efisiensi dan efektivitas pengelolaan pajak dan retribusi daerah
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    Mendukung peningkatan Pendapatan Asli Daerah (PAD) Jawa Tengah
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    Memberikan akses informasi yang akurat dan real-time kepada masyarakat
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sistem Terpercaya</h3>
              <p className="text-blue-100 mb-6">
                Penak Busiti Jane telah dipercaya oleh Pemerintah Provinsi Jawa Tengah sebagai platform resmi untuk
                mengelola pajak dan retribusi daerah.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm text-blue-100">Objek Retribusi</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-blue-100">OPD Terdaftar</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Keunggulan Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tim Pengelola</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium">{member.position}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Hubungi Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Alamat</h3>
              <p className="text-sm text-gray-600">
                Jl. Pahlawan No. 9 Semarang
                <br />
                Kode Pos 50243
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Telepon</h3>
              <p className="text-sm text-gray-600">024-8311173 (20 saluran)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-sm text-gray-600">setda@jatengprov.go.id</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
              <p className="text-sm text-gray-600">jatengprov.go.id</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutUsPage
