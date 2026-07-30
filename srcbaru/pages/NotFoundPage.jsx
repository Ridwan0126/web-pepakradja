import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.h1
          className="text-9xl font-bold text-primary mb-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          404
        </motion.h1>

        <h2 className="text-3xl font-bold text-foreground mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Maaf, halaman yang Anda cari tidak ada. Mungkin telah dipindahkan atau dihapus.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          <Home className="w-5 h-5" />
          Kembali ke Beranda
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  )
}
