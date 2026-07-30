import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, ShoppingCart, Phone, Mail } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const objekData = {
  1: {
    nama: 'Wisata Lawang Sewu',
    harga: 15000,
    deskripsi: 'Istana bersejarah dengan arsitektur Belanda yang indah',
    lokasi: 'Jl. Pemuda, Semarang',
    jam: '08:00 - 17:00',
    foto: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80',
  },
}

export default function ObyekDetailPage() {
  const { id } = useParams()
  const obyek = objekData[id] || objekData[1]
  const [jumlah, setJumlah] = useState(1)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Image */}
            <div className="lg:col-span-2">
              <img
                src={obyek.foto}
                alt={obyek.nama}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{obyek.nama}</h1>
              <p className="text-lg text-muted-foreground mb-6">{obyek.deskripsi}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{obyek.lokasi}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{obyek.jam}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">Rp {obyek.harga.toLocaleString()}</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">Jumlah Tiket</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                    className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-foreground">{jumlah}</span>
                  <button
                    onClick={() => setJumlah(jumlah + 1)}
                    className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-muted p-6 rounded-2xl mb-8">
                <p className="text-sm text-muted-foreground mb-2">Total Harga</p>
                <p className="text-3xl font-bold text-primary">Rp {(obyek.harga * jumlah).toLocaleString()}</p>
              </div>

              {/* Add to Cart */}
              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity mb-4">
                <ShoppingCart className="w-5 h-5" />
                Masukkan Keranjang
              </button>

              {/* Contact */}
              <div className="space-y-3 pt-8 border-t border-border">
                <p className="text-sm font-semibold text-foreground">Hubungi Kami</p>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>Telepon</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* ProfilPage same as ProfilePage */}
        </div>
      </main>

      <Footer />
    </div>
  )
}
