import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Eye, ArrowRight, Loader2 } from 'lucide-react'
import { formatCurrency } from '../utils'

// Sample data for demonstration
const sampleData = [
  {
    id_obyek: 1,
    nama_obyek: "Wisata Lawang Sewu",
    jenis_retribusi: "Wisata",
    tarif: 15000,
    alamat: "Jl. Pemuda, Semarang",
    opd: "BAPENDA Jateng",
    foto_1: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&q=80",
  },
  {
    id_obyek: 2,
    nama_obyek: "Museum Ronggowarsito",
    jenis_retribusi: "Wisata",
    tarif: 10000,
    alamat: "Jl. Abdulrahman Saleh, Semarang",
    opd: "BAPENDA Jateng",
    foto_1: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400&q=80",
  },
  {
    id_obyek: 3,
    nama_obyek: "Candi Gedong Songo",
    jenis_retribusi: "Wisata",
    tarif: 20000,
    alamat: "Bandungan, Kab. Semarang",
    opd: "BAPENDA Jateng",
    foto_1: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400&q=80",
  },
  {
    id_obyek: 4,
    nama_obyek: "Umbul Sidomukti",
    jenis_retribusi: "Wisata",
    tarif: 25000,
    alamat: "Bandungan, Kab. Semarang",
    opd: "BAPENDA Jateng",
    foto_1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    id_obyek: 5,
    nama_obyek: "Retribusi Parkir Simpang Lima",
    jenis_retribusi: "Parkir",
    tarif: 5000,
    alamat: "Simpang Lima, Semarang",
    opd: "BAPENDA Jateng",
    foto_1: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80",
  },
  {
    id_obyek: 6,
    nama_obyek: "Pasar Johar",
    jenis_retribusi: "Pasar",
    tarif: 10000,
    alamat: "Jl. Agus Salim, Semarang",
    opd: "BAPENDA Jateng",
    foto_1: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80",
  },
  {
    id_obyek: 7,
    nama_obyek: "Wisata Alam Dieng",
    jenis_retribusi: "Wisata",
    tarif: 30000,
    alamat: "Dieng, Wonosobo",
    opd: "BAPENDA Jateng",
    foto_1: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    id_obyek: 8,
    nama_obyek: "Candi Borobudur Area",
    jenis_retribusi: "Wisata",
    tarif: 50000,
    alamat: "Magelang, Jawa Tengah",
    opd: "BAPENDA Jateng",
    foto_1: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&q=80",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function ObyekList({ filters }) {
  const [obyekList, setObyekList] = useState([])
  const [displayedItems, setDisplayedItems] = useState(20)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading with dummy data
    const timer = setTimeout(() => {
      setObyekList(sampleData)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Filter obyek based on filters prop
  const filteredObyek = obyekList.filter((obyek) => {
    if (!filters) return true
    
    const searchMatch = !filters.search || 
      obyek.nama_obyek?.toLowerCase().includes(filters.search.toLowerCase()) ||
      obyek.alamat?.toLowerCase().includes(filters.search.toLowerCase())
    
    const kotaMatch = !filters.kota || obyek.kota === filters.kota
    const jenisMatch = !filters.jenis || obyek.jenis_retribusi === filters.jenis
    
    return searchMatch && kotaMatch && jenisMatch
  })

  const displayedObyek = filteredObyek.slice(0, displayedItems)
  const hasMore = displayedItems < filteredObyek.length

  const loadMore = () => {
    setDisplayedItems((prev) => prev + 20)
  }

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Memuat data obyek retribusi...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Obyek Retribusi
            </h2>
            <p className="text-muted-foreground">
              Menampilkan {displayedObyek.length} dari {filteredObyek.length} obyek
            </p>
          </div>
          <Link
            to="/#obyek"
            className="hidden sm:flex items-center gap-2 text-primary hover:underline"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        {displayedObyek.length > 0 ? (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {displayedObyek.map((obyek, index) => (
                <motion.div key={obyek.id_obyek || index} variants={item}>
                  <Link to={`/obyek/${obyek.id_obyek}`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={obyek.foto_1 || obyek.foto || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80'}
                          alt={obyek.nama_obyek || 'Obyek Retribusi'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Badge */}
                        {obyek.jenis_retribusi && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
                            {obyek.jenis_retribusi}
                          </span>
                        )}

                        {/* Price */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-bold text-lg">
                            {formatCurrency(obyek.tarif || obyek.harga)}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {obyek.nama_obyek || 'Nama Obyek'}
                        </h3>
                        
                        <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{obyek.alamat || obyek.lokasi || 'Jawa Tengah'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {obyek.opd || obyek.pengelola || 'BAPENDA'}
                          </span>
                          <div className="flex items-center gap-1 text-primary">
                            <Eye className="w-4 h-4" />
                            <span className="text-xs font-medium">Detail</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadMore}
                  className="px-8 py-4 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
                >
                  Lihat Lebih Banyak ({filteredObyek.length - displayedItems} lagi)
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Tidak ada obyek retribusi yang ditemukan</p>
          </div>
        )}
      </div>
    </section>
  )
}
