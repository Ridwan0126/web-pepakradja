import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-smooth transform group-hover:scale-110">
                <span className="text-white font-bold text-lg">PR</span>
              </div>
              <div>
                <span className="text-lg font-bold block">PEPAK RAJA</span>
                <span className="text-xs text-blue-400">Marketplace Retribusi</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Solusi terpercaya untuk semua kebutuhan pajak dan retribusi Anda dengan layanan profesional dan harga kompetitif.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-smooth transform hover:scale-110"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Menu Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Menu</h3>
            <ul className="space-y-3">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Katalog', href: '/products' },
                { label: 'Keranjang', href: '/cart' },
                { label: 'Tentang Kami', href: '#' },
              ].map((item, i) => (
                <li key={i}>
                  <Link 
                    to={item.href} 
                    className="text-gray-400 hover:text-blue-400 transition-smooth flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-blue-400 group-hover:w-2 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Kategori</h3>
            <ul className="space-y-3">
              {[
                { label: 'Layanan Pajak', href: '#' },
                { label: 'Layanan Retribusi', href: '#' },
                { label: 'Konsultasi', href: '#' },
                { label: 'Pajak Daerah', href: '#' },
              ].map((item, i) => (
                <li key={i}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-blue-400 transition-smooth flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-blue-400 group-hover:w-2 transition-all" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Dukungan</h3>
            <ul className="space-y-3">
              {[
                { label: 'Hubungi Kami', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Syarat & Ketentuan', href: '#' },
                { label: 'Kebijakan Privasi', href: '#' },
              ].map((item, i) => (
                <li key={i}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-blue-400 transition-smooth flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-blue-400 group-hover:w-2 transition-all" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Telepon</p>
                  <a href="tel:+62xxx" className="text-white hover:text-blue-400 transition-smooth">+62 (xxx) xxxx-xxxx</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href="mailto:support@pepakraja.com" className="text-white hover:text-blue-400 transition-smooth">support@pepakraja.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Alamat</p>
                  <p className="text-white text-sm">Semarang, Jawa Tengah</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2024 PEPAK RAJA. Semua hak dilindungi. Marketplace terpercaya untuk pajak dan retribusi.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Peta Situs</a>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <a 
          href="https://wa.me/62xxx"
          className="w-14 h-14 bg-blue-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-smooth transform hover:scale-110 active:scale-95"
          title="WhatsApp"
        >
          <span className="text-2xl">💬</span>
        </a>
      </div>
    </footer>
  )
}
