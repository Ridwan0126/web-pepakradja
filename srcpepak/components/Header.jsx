// import { Link, useNavigate } from 'react-router-dom'
// import { ShoppingCart, Menu, X, User, LogOut, Home, Settings, Search } from 'lucide-react'
// import { useAuth } from '../contexts/AuthContext'
// import { useCartStore } from '../stores/cartStore'
// import { useState } from 'react'

// export default function Header() {
//   const { user, logout, isAuthenticated } = useAuth()
//   const { getTotalItems } = useCartStore()
//   const navigate = useNavigate()
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [searchOpen, setSearchOpen] = useState(false)

//   const handleLogout = () => {
//     logout()
//     navigate('/')
//     setMobileMenuOpen(false)
//   }

//   return (
//     <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg sticky top-0 z-40 transition-smooth">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-3 group">
//           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-smooth transform group-hover:scale-110">
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">PR</span>
//           </div>
//           <div className="hidden sm:flex flex-col">
//             <span className="text-xl font-bold text-white">PEPAK RAJA</span>
//             <span className="text-xs text-blue-100">Marketplace Retribusi</span>
//           </div>
//         </Link>

//         {/* Desktop Menu */}
//         <nav className="hidden md:flex items-center gap-8">
//           <Link to="/" className="text-white hover:text-blue-100 font-semibold transition-smooth relative group">
//             Home
//             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
//           </Link>
//           <Link to="/products" className="text-white hover:text-blue-100 font-semibold transition-smooth relative group">
//             Katalog
//             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
//           </Link>
//           <Link to="/transactions" className="text-white hover:text-blue-100 font-semibold transition-smooth relative group">
//             Pembayaran
//             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
//           </Link>
//         </nav>

//         {/* Right Side */}
//         <div className="flex items-center gap-4">
//           {/* Search */}
//           <button
//             className="hidden md:block p-2 hover:bg-blue-500 rounded-full transition-smooth"
//             onClick={() => setSearchOpen(!searchOpen)}
//           >
//             <Search className="w-5 h-5 text-white" />
//           </button>

//           {/* Cart */}
//           <Link to="/cart" className="relative p-2 hover:bg-indigo-500 rounded-full transition-smooth">
//             <ShoppingCart className="w-5 h-5 text-white" />
//             {getTotalItems() > 0 && (
//               <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-bounce-slow shadow-lg">
//                 {getTotalItems()}
//               </span>
//             )}
//           </Link>

//           {/* User Menu */}
//           {isAuthenticated ? (
//             <div className="relative group hidden md:block">
//               <button className="flex items-center gap-2 px-3 py-2 text-white hover:bg-indigo-500 rounded-lg transition-smooth font-semibold">
//                 <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-green-600 text-xs font-bold">
//                   {user?.name?.charAt(0) || 'U'}
//                 </div>
//                 <span className="truncate max-w-[100px] hidden lg:inline">{user?.name || 'User'}</span>
//               </button>
//               <div className="absolute right-0 mt-2 w-56 bg-white shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right group-hover:scale-100 scale-95">
//                 <div className="p-4 border-b border-blue-100">
//                   <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
//                   <p className="text-sm text-gray-500 capitalize">{user?.role || 'user'}</p>
//                 </div>
//                 <div className="p-2">
//                   <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-smooth flex items-center gap-3 font-medium">
//                     <Home className="w-4 h-4" />
//                     Dashboard
//                   </Link>
//                   {(user?.role === 'admin' || user?.role === 'superadmin') && (
//                     <Link to={user?.role === 'admin' ? '/admin' : '/superadmin'} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-smooth flex items-center gap-3 font-medium">
//                       <Settings className="w-4 h-4" />
//                       {user?.role === 'superadmin' ? 'SuperAdmin Panel' : 'Admin Panel'}
//                     </Link>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center gap-3 font-medium border-t border-blue-100"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   Logout
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="hidden md:flex gap-2">
//               <Link to="/login" className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-smooth font-semibold">
//                 Login
//               </Link>
//               <Link to="/register" className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-smooth font-semibold shadow-lg">
//                 Sign Up
//               </Link>
//             </div>
//           )}

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2 hover:bg-indigo-500 rounded-lg transition-smooth"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? (
//               <X className="w-6 h-6 text-white" />
//             ) : (
//               <Menu className="w-6 h-6 text-white" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-gradient-to-b from-indigo-500 to-purple-600 border-t border-indigo-400 animate-slide-in-down">
//           <div className="px-4 py-4 space-y-2">
//             <Link to="/" className="block px-4 py-3 text-white hover:bg-indigo-400 rounded-lg transition-smooth font-semibold" onClick={() => setMobileMenuOpen(false)}>
//               Home
//             </Link>
//             <Link to="/products" className="block px-4 py-3 text-white hover:bg-indigo-400 rounded-lg transition-smooth font-semibold" onClick={() => setMobileMenuOpen(false)}>
//               Katalog
//             </Link>
//             <Link to="/transactions" className="block px-4 py-3 text-white hover:bg-indigo-400 rounded-lg transition-smooth font-semibold" onClick={() => setMobileMenuOpen(false)}>
//               Pembayaran
//             </Link>

//             {isAuthenticated ? (
//               <>
//                 <Link to="/dashboard" className="block px-4 py-3 text-white hover:bg-indigo-400 rounded-lg transition-smooth font-semibold" onClick={() => setMobileMenuOpen(false)}>
//                   Dashboard
//                 </Link>
//                 {(user?.role === 'admin' || user?.role === 'superadmin') && (
//                   <Link to={user?.role === 'admin' ? '/admin' : '/superadmin'} className="block px-4 py-3 text-white hover:bg-indigo-400 rounded-lg transition-smooth font-semibold" onClick={() => setMobileMenuOpen(false)}>
//                     {user?.role === 'superadmin' ? 'SuperAdmin Panel' : 'Admin Panel'}
//                   </Link>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-3 text-white hover:bg-red-600 rounded-lg transition-smooth font-semibold mt-2"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="block px-4 py-3 text-white hover:bg-indigo-400 rounded-lg transition-smooth font-semibold" onClick={() => setMobileMenuOpen(false)}>
//                   Login
//                 </Link>
//                 <Link to="/register" className="block px-4 py-3 text-white hover:bg-indigo-400 rounded-lg transition-smooth font-semibold" onClick={() => setMobileMenuOpen(false)}>
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }

import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  Search,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { useCartStore } from "../stores/cartStore";
import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const [activeCategory, setActiveCategory] = useState("Virtual Products");

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const menuData = {
    home: {
      title: "Home Services",
      description: "Berbagai layanan utama marketplace modern.",
      icon: "🏠",

      categories: {
        "Virtual Products": [
          {
            title: "Pulsa",
            desc: "Isi ulang pulsa digital",
            icon: "📱",
            path: "/products/pulsa",
          },

          {
            title: "Paket Data",
            desc: "Internet cepat semua operator",
            icon: "🌐",
            path: "/products/paket-data",
          },

          {
            title: "Voucher Game",
            desc: "Top up game favorit",
            icon: "🎮",
            path: "/products/voucher-game",
          },
        ],

        Elektronik: [
          {
            title: "Laptop",
            desc: "Elektronik modern",
            icon: "💻",
            path: "/products/laptop",
          },

          {
            title: "Smartphone",
            desc: "HP dan gadget terbaru",
            icon: "📱",
            path: "/products/smartphone",
          },

          {
            title: "Aksesoris",
            desc: "Perangkat tambahan",
            icon: "🎧",
            path: "/products/aksesoris",
          },
        ],

        Gaming: [
          {
            title: "Steam Wallet",
            desc: "Voucher Steam",
            icon: "🎮",
            path: "/products/steam",
          },

          {
            title: "Mobile Legends",
            desc: "Diamond MLBB",
            icon: "🔥",
            path: "/products/ml",
          },

          {
            title: "Valorant",
            desc: "Top up Valorant",
            icon: "⚔️",
            path: "/products/valorant",
          },
        ],

        Voucher: [
          {
            title: "Netflix",
            desc: "Voucher streaming",
            icon: "🎬",
            path: "/products/netflix",
          },

          {
            title: "Spotify",
            desc: "Musik premium",
            icon: "🎵",
            path: "/products/spotify",
          },
        ],

        Fashion: [
          {
            title: "Kaos",
            desc: "Fashion kekinian",
            icon: "👕",
            path: "/products/kaos",
          },

          {
            title: "Sepatu",
            desc: "Sneakers modern",
            icon: "👟",
            path: "/products/sepatu",
          },
        ],

        Kesehatan: [
          {
            title: "Vitamin",
            desc: "Kesehatan tubuh",
            icon: "💊",
            path: "/products/vitamin",
          },

          {
            title: "Masker",
            desc: "Perlengkapan kesehatan",
            icon: "😷",
            path: "/products/masker",
          },
        ],
      },
    },

    katalog: {
      title: "Katalog",
      description: "Masuk ke halaman katalog produk.",
      icon: "🛒",

      items: [
        {
          title: "Katalog",
          desc: "Lihat semua produk",
          icon: "📦",
          path: "/products",
        },
      ],
    },

    pembayaran: {
      title: "Transaksi",
      description: "Riwayat dan pembayaran transaksi.",
      icon: "💳",

      items: [
        {
          title: "Transaksi",
          desc: "Lihat riwayat pembayaran",
          icon: "💰",
          path: "/transactions",
        },
      ],
    },
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-3 md:px-6">
      <header className="max-w-7xl mx-auto rounded-[32px] border border-gray-200 bg-white shadow-2xl overflow-visible">
        {/* MAIN NAVBAR */}
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              {/* MOBILE BUTTON */}
              <button
                className="md:hidden p-2 rounded-2xl hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>

              {/* LOGO */}
              <Link to="/" className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <span className="text-white font-bold text-lg">PR</span>
                </motion.div>

                <div className="hidden sm:flex flex-col">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                    PEPAK RAJA
                  </span>

                  <span className="text-xs text-gray-500">
                    Marketplace Retribusi
                  </span>
                </div>
              </Link>

              {/* CATEGORY */}
              <div
                className="relative hidden md:block"
                onMouseEnter={() => setShowCategory(true)}
                onMouseLeave={() => setShowCategory(false)}
              >
                <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all font-medium text-gray-700">
                  Kategori
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showCategory ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN */}
                <AnimatePresence>
                  {showCategory && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 15,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="absolute top-full mt-4 left-0 z-[999] w-[950px] rounded-[32px] border border-gray-200 bg-white shadow-2xl overflow-hidden"
                    >
                      {/* TOP MENU */}
                      <div className="flex items-center gap-8 px-8 py-5 border-b border-gray-100 bg-white">
                        <button
                          onClick={() => setActiveMenu("home")}
                          className={`relative font-semibold transition ${
                            activeMenu === "home"
                              ? "text-blue-600"
                              : "text-gray-600 hover:text-blue-600"
                          }`}
                        >
                          Home
                          {activeMenu === "home" && (
                            <motion.div
                              layoutId="activeMenu"
                              className="absolute -bottom-2 left-0 w-full h-1 rounded-full bg-blue-600"
                            />
                          )}
                        </button>

                        <button
                          onClick={() => setActiveMenu("katalog")}
                          className={`relative font-semibold transition ${
                            activeMenu === "katalog"
                              ? "text-blue-600"
                              : "text-gray-600 hover:text-blue-600"
                          }`}
                        >
                          Katalog
                          {activeMenu === "katalog" && (
                            <motion.div
                              layoutId="activeMenu"
                              className="absolute -bottom-2 left-0 w-full h-1 rounded-full bg-blue-600"
                            />
                          )}
                        </button>

                        <button
                          onClick={() => setActiveMenu("pembayaran")}
                          className={`relative font-semibold transition ${
                            activeMenu === "pembayaran"
                              ? "text-blue-600"
                              : "text-gray-600 hover:text-blue-600"
                          }`}
                        >
                          Pembayaran
                          {activeMenu === "pembayaran" && (
                            <motion.div
                              layoutId="activeMenu"
                              className="absolute -bottom-2 left-0 w-full h-1 rounded-full bg-blue-600"
                            />
                          )}
                        </button>
                      </div>

                      {/* CONTENT */}
                      <div
                        className={`grid ${
                          activeMenu === "home"
                            ? "grid-cols-[260px_1fr]"
                            : "grid-cols-1"
                        }`}
                      >
                        {/* SIDEBAR ONLY HOME */}
                        {activeMenu === "home" && (
                          <div className="bg-gray-50 border-r border-gray-100 p-5 h-[430px] overflow-y-auto">
                            <div className="space-y-2">
                              {Object.keys(menuData.home.categories).map(
                                (item, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setActiveCategory(item)}
                                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${
                                      activeCategory === item
                                        ? "bg-white shadow-md text-blue-600 font-semibold"
                                        : "hover:bg-white hover:shadow-sm text-gray-700"
                                    }`}
                                  >
                                    {item}
                                  </button>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* RIGHT CONTENT */}
                        <div className="p-8">
                          {/* HEADER */}
                          <div className="flex items-start gap-5">
                            <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg">
                              {menuData[activeMenu].icon}
                            </div>

                            <div>
                              <h2 className="text-3xl font-bold text-gray-800">
                                {menuData[activeMenu].title}
                              </h2>

                              <p className="text-gray-500 mt-2 max-w-xl leading-relaxed">
                                {menuData[activeMenu].description}
                              </p>
                            </div>
                          </div>

                          {/* ITEMS */}
                          <div
                            className={`grid gap-5 mt-10 ${
                              activeMenu === "home"
                                ? "grid-cols-3"
                                : "grid-cols-1"
                            }`}
                          >
                            {(activeMenu === "home"
                              ? menuData.home.categories[activeCategory]
                              : menuData[activeMenu].items
                            ).map((item, index) => (
                              <Link key={index} to={item.path}>
                                <motion.div
                                  whileHover={{
                                    y: -5,
                                    scale: 1.02,
                                  }}
                                  transition={{
                                    duration: 0.2,
                                  }}
                                  className="group p-5 rounded-3xl border border-gray-100 bg-white hover:shadow-xl transition-all cursor-pointer h-full"
                                >
                                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition">
                                    {item.icon}
                                  </div>

                                  <h3 className="font-bold text-gray-800 text-lg">
                                    {item.title}
                                  </h3>

                                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                    {item.desc}
                                  </p>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* SEARCH */}
            <div className="hidden lg:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Cari layanan atau retribusi..."
                  className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* CART */}
              <Link
                to="/cart"
                className="relative w-12 h-12 rounded-2xl hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />

                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {/* USER */}
              {isAuthenticated ? (
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-100 transition-all">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold shadow">
                      {user?.name?.charAt(0) || "U"}
                    </div>

                    <div className="hidden lg:block text-left">
                      <p className="font-semibold text-sm text-gray-800">
                        {user?.name || "User"}
                      </p>

                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role || "user"}
                      </p>
                    </div>
                  </button>

                  {/* USER DROPDOWN */}
                  <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-5 border-b border-gray-100">
                      <p className="font-bold text-gray-800">
                        {user?.name || "User"}
                      </p>

                      <p className="text-sm text-gray-500 capitalize">
                        {user?.role || "user"}
                      </p>
                    </div>

                    <div className="p-3 space-y-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all"
                      >
                        <Home className="w-4 h-4" />
                        Dashboard
                      </Link>

                      {(user?.role === "admin" ||
                        user?.role === "superadmin") && (
                        <Link
                          to={user?.role === "admin" ? "/admin" : "/superadmin"}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all"
                        >
                          <Settings className="w-4 h-4" />

                          {user?.role === "superadmin"
                            ? "SuperAdmin Panel"
                            : "Admin Panel"}
                        </Link>
                      )}
                    </div>

                    <div className="p-3 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex gap-2">
                  <Link
                    to="/login"
                    className="px-5 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100 transition-all font-semibold text-gray-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-105 transition-all font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="md:hidden border-t border-gray-100 bg-white"
            >
              <div className="p-5 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all font-medium"
                >
                  Home
                </Link>

                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all font-medium"
                >
                  Katalog
                </Link>

                <Link
                  to="/transactions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all font-medium"
                >
                  Pembayaran
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all font-medium"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all font-medium"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
