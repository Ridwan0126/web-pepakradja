import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink,
  Heart
} from 'lucide-react'

const footerLinks = {
  layanan: [
    { label: 'Obyek Retribusi', href: '/obyek' },
    { label: 'Tiket Wisata', href: '/tiket' },
    { label: 'Sewa Aset', href: '/sewa' },
    { label: 'SKRD', href: '/skrd' },
  ],
  informasi: [
    { label: 'Tentang Kami', href: '/tentang' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Syarat & Ketentuan', href: '/syarat' },
    { label: 'Kebijakan Privasi', href: '/privasi' },
  ],
  kontak: [
    { icon: MapPin, text: 'Jl. Pemuda No. 2, Semarang, Jawa Tengah' },
    { icon: Phone, text: '(024) 3544314' },
    { icon: Mail, text: 'bapenda@jatengprov.go.id' },
  ],
  social: [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-primary rounded-xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">PR</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">PEPAK RAJA</h2>
                <p className="text-xs text-muted-foreground">Jawa Tengah</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Platform layanan pajak dan retribusi daerah Provinsi Jawa Tengah yang mudah, cepat, dan transparan.
            </p>
            <div className="flex items-center gap-3">
              {footerLinks.social.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Layanan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Layanan</h3>
            <ul className="space-y-3">
              {footerLinks.layanan.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Informasi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Informasi</h3>
            <ul className="space-y-3">
              {footerLinks.informasi.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Kontak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Hubungi Kami</h3>
            <ul className="space-y-4">
              {footerLinks.kontak.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              &copy; {new Date().getFullYear()} BAPENDA Provinsi Jawa Tengah. Semua hak dilindungi.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Dibuat dengan <Heart className="w-4 h-4 text-destructive fill-current" /> untuk Jawa Tengah
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
