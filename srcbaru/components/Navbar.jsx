import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  FileText, 
  QrCode, 
  Home,
  Building2,
  CreditCard,
  HelpCircle,
  Phone,
  Receipt,
  Settings,
  Bell
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const menuItems = [
  {
    label: 'Beranda',
    href: '/',
    icon: Home,
  },
  {
    label: 'Layanan',
    icon: Building2,
    submenu: [
      { label: 'Obyek Retribusi', href: '/#obyek', icon: Building2 },
      { label: 'Keranjang', href: '/keranjang', icon: Receipt },
    ],
  },
  {
    label: 'Transaksi',
    icon: CreditCard,
    submenu: [
      { label: 'SKRD Saya', href: '/skrd', icon: FileText },
      { label: 'Cek Pembayaran', href: '/pembayaran', icon: CreditCard },
      { label: 'Riwayat Transaksi', href: '/riwayat', icon: Receipt },
    ],
  },
  {
    label: 'Bantuan',
    icon: HelpCircle,
    submenu: [
      { label: 'Pusat Bantuan', href: '/bantuan', icon: HelpCircle },
      { label: 'Tentang Kami', href: '/tentang', icon: Building2 },
    ],
  },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-10 h-10 lg:w-12 lg:h-12"
            >
              <div className="absolute inset-0 bg-primary rounded-xl rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg lg:text-xl">PR</span>
              </div>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold text-foreground">PEPAK RAJA</h1>
              <p className="text-xs text-muted-foreground">Pelayanan Pajak & Retribusi Jateng</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {menuItems.map((item, index) => (
              <div key={index} className="relative">
                {item.submenu ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeDropdown === index
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-all"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {item.submenu && activeDropdown === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
                    >
                      {item.submenu.map((subitem, subindex) => (
                        <Link
                          key={subindex}
                          to={subitem.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <subitem.icon className="w-4 h-4 text-primary" />
                          {subitem.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search */}
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Cari layanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 lg:w-64 px-4 py-2 pl-10 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </motion.div>
              ) : null}
            </AnimatePresence>
            
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* QR Scanner */}
            <Link 
              to="/scan-qr" 
              className="p-2 rounded-lg hover:bg-muted transition-colors hidden sm:flex"
              title="Scan QR SKRD"
            >
              <QrCode className="w-5 h-5" />
            </Link>

            {/* Auth Buttons / Profile */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="hidden lg:block text-sm font-medium max-w-32 truncate">
                    {user.nama || user.email}
                  </span>
                  <ChevronDown className={`hidden lg:block w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
                    >
                      <div className="p-4 border-b border-border">
                        <p className="font-semibold text-foreground truncate">{user.nama}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email_rpp || user.email}</p>
                        {user.npwpd && (
                          <p className="text-xs text-primary mt-1">NPWPD: {user.npwpd}</p>
                        )}
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profil"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profil Saya
                        </Link>
                        <Link
                          to="/skrd"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          SKRD Saya
                        </Link>
                        <Link
                          to="/notifikasi"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Bell className="w-4 h-4" />
                          Notifikasi
                        </Link>
                        <Link
                          to="/pengaturan"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Pengaturan
                        </Link>
                      </div>
                      <div className="border-t border-border py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 overflow-hidden"
                          >
                            {item.submenu.map((subitem, subindex) => (
                              <Link
                                key={subindex}
                                to={subitem.href}
                                onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              >
                                <subitem.icon className="w-4 h-4" />
                                {subitem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Auth */}
              {!user && (
                <div className="pt-4 border-t border-border space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
