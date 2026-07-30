import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Ticket, 
  FileText, 
  CreditCard, 
  QrCode, 
  History,
  MapPin,
  Receipt
} from 'lucide-react'

const quickMenuItems = [
  {
    icon: Building2,
    label: 'Obyek Retribusi',
    description: 'Lihat semua obyek',
    href: '/obyek',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Ticket,
    label: 'Tiket Wisata',
    description: 'Beli tiket online',
    href: '/tiket',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: FileText,
    label: 'SKRD Saya',
    description: 'Unduh dokumen SKRD',
    href: '/skrd',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: CreditCard,
    label: 'Pembayaran',
    description: 'Cek status bayar',
    href: '/pembayaran',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: QrCode,
    label: 'Scan QR',
    description: 'Scan kode SKRD',
    href: '/scan-qr',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: History,
    label: 'Riwayat',
    description: 'Lihat transaksi',
    href: '/riwayat',
    color: 'from-purple-500 to-purple-600',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function QuickMenu() {
  return (
    <section className="py-8 lg:py-12 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6"
        >
          {quickMenuItems.map((menuItem, index) => (
            <motion.div key={index} variants={item}>
              <Link
                to={menuItem.href}
                className="group flex flex-col items-center text-center p-4 lg:p-6 rounded-2xl hover:bg-muted transition-all"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${menuItem.color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <menuItem.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </motion.div>
                <h3 className="text-sm lg:text-base font-semibold text-foreground mb-1">
                  {menuItem.label}
                </h3>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {menuItem.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
