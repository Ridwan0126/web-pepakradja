import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Home,
  ChevronDown,
  UserCircle,
  Search,
  MapPin,
  Building2,
  Wallet,
  XCircle,
} from "lucide-react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const [activeCategory, setActiveCategory] = useState("Tanah");

  // SEARCH
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // AUTH
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // =========================
  // CHECK SESSION
  // =========================
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    const session = localStorage.getItem("wr_session");

    if (!session) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const parsed = JSON.parse(session);

      if (Date.now() > parsed.expiredAt) {
        localStorage.removeItem("wr_session");
        localStorage.removeItem("wr_user_header");

        setIsAuthenticated(false);
        setUser(null);

        return;
      }

      setIsAuthenticated(true);
      setUser(parsed.user);
    } catch (err) {
      console.error(err);

      localStorage.removeItem("wr_session");
      localStorage.removeItem("wr_user_header");

      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("wr_session");
    localStorage.removeItem("wr_user_header");

    setIsAuthenticated(false);
    setUser(null);

    navigate("/login");

    setMobileMenuOpen(false);
  };

  // =========================
  // AUTO SEARCH
  // =========================
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search.trim()) {
        handleSearch(search);
      } else {
        setSearchResults([]);
        setSearchOpen(false);
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [search]);

  // =========================
  // SEARCH API
  // =========================
  const handleSearch = async (keywordSearch = search) => {
    try {
      const keyword = keywordSearch.toLowerCase().trim();

      if (!keyword) {
        setSearchResults([]);
        setSearchOpen(false);
        return;
      }

      setLoadingSearch(true);
      setSearchOpen(true);

      let allData = [];
      let currentPage = 1;
      let hasMore = true;

      // =========================
      // AMBIL SEMUA DATA API
      // =========================
      while (hasMore) {
        const response = await fetch(
          `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/penakbusiti/obyek-retribusi?page=${currentPage}&limit=100&search=${encodeURIComponent(
            keyword,
          )}`,
        );

        const result = await response.json();

        const apiData = result?.data || [];

        if (apiData.length > 0) {
          allData = [...allData, ...apiData];
          currentPage++;
        } else {
          hasMore = false;
        }

        // BATAS KEAMANAN
        if (currentPage > 50) {
          hasMore = false;
        }
      }

      // =========================
      // FILTER SEARCH
      // =========================
      const filtered = allData.filter((item) => {
        const obyek = item?.obyek_retribusi?.toLowerCase() || "";

        const opd = item?.opd?.nama?.toLowerCase() || "";

        const uppd = item?.uppd?.nama?.toLowerCase() || "";

        const kota = item?.kota?.kab_kota?.toLowerCase() || "";

        const kecamatan = item?.kecamatan?.kecamatan?.toLowerCase() || "";

        const jenis = item?.jenis?.jenis_retribusi?.toLowerCase() || "";

        return (
          obyek.includes(keyword) ||
          opd.includes(keyword) ||
          uppd.includes(keyword) ||
          kota.includes(keyword) ||
          kecamatan.includes(keyword) ||
          jenis.includes(keyword)
        );
      });

      setSearchResults(filtered);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // =========================
  // MENU DATA
  // =========================
  const menuData = {
    home: {
      categories: {
        Tanah: [
          {
            title: "Sewa Tanah",
            path: "/tanah/sewa-tanah",
          },
          {
            title: "Bangunan Semi Permanen",
            path: "/tanah/bangunan-semi-permanen",
          },
          {
            title: "Jalan Masuk",
            path: "/tanah/jalan-masuk",
          },
        ],

        Bangunan: [
          {
            title: "Lantai Jemur",
            path: "/bangunan/lantai-jemur",
          },
          {
            title: "Rumah Dinas",
            path: "/bangunan/rumah-dinas",
          },
          {
            title: "Sewa Gedung",
            path: "/bangunan/sewa-gedung",
          },
        ],
      },
    },

    penetapan: {
      items: [
        {
          title: "SKRD",
          path: "/skrd",
        },
        {
          title: "Pembayaran",
          path: "/pembayaran",
        },
      ],
    },

    tiketonline: {
      items: [
        {
          title: "Pariwisata",
          path: "/pariwisata",
        },
      ],
    },

    lainnya: {
      items: [
        {
          title: "PAP",
          path: "/pap",
        },
        {
          title: "PAB",
          path: "/pab",
        },
      ],
    },
  };

  const topMenus = [
    {
      key: "home",
      label: "Home",
    },

    ...(isAuthenticated
      ? [
          {
            key: "penetapan",
            label: "Penetapan",
          },
        ]
      : []),

    {
      key: "tiketonline",
      label: "Tiket Online",
    },

    {
      key: "lainnya",
      label: "Lain-lain",
    },
  ];

  return (
    <>
      {/* BLUR */}
      <AnimatePresence>
        {searchOpen && search.trim() && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => {
              setSearchOpen(false);
              setSearch("");
              setSearchResults([]);
            }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
          />
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="fixed top-4 left-0 right-0 z-50 px-3 md:px-6">
        <header className="max-w-7xl mx-auto rounded-[30px] border border-gray-200/70 bg-white/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-visible">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <button
                  className="md:hidden p-2 rounded-2xl hover:bg-gray-100 transition-all"
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
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center justify-center"
                  >
                    <img
                      src="/images/logopepakraja.png"
                      alt="Logo"
                      className="h-12 w-auto object-contain"
                    />
                  </motion.div>

                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-lg font-bold text-gray-800">
                      PEPAK RAJA
                    </span>

                    <span className="text-xs text-gray-500">
                      Marketplace Retribusi
                    </span>
                  </div>
                </Link>

                {/* MENU */}
                <div
                  className="relative hidden md:block z-[10001]"
                  onMouseEnter={() => setShowCategory(true)}
                  onMouseLeave={() => setShowCategory(false)}
                >
                  <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all font-medium text-gray-700">
                    Menu
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        showCategory ? "rotate-180" : ""
                      }`}
                    />
                  </button>

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
                        className="absolute top-full mt-4 left-0 z-[10002] w-[950px] rounded-[30px] border border-gray-200 bg-white shadow-2xl overflow-hidden"
                      >
                        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-white">
                          {topMenus.map((menu) => (
                            <button
                              key={menu.key}
                              onClick={() => setActiveMenu(menu.key)}
                              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                                activeMenu === menu.key
                                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                            >
                              {menu.label}
                            </button>
                          ))}
                        </div>

                        <div
                          className={`grid ${
                            activeMenu === "home"
                              ? "grid-cols-[260px_1fr]"
                              : "grid-cols-1"
                          }`}
                        >
                          {activeMenu === "home" && (
                            <div className="bg-gray-50 border-r border-gray-100 p-5 h-[450px] overflow-y-auto">
                              <div className="space-y-2">
                                {Object.keys(menuData.home.categories).map(
                                  (item, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setActiveCategory(item)}
                                      className={`w-full text-left px-4 py-3 rounded-2xl transition-all text-sm ${
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

                          <div className="p-7">
                            <div className="grid gap-4 grid-cols-2">
                              {(activeMenu === "home"
                                ? menuData.home.categories[activeCategory]
                                : menuData[activeMenu]?.items || []
                              ).map((item, index) => (
                                <Link key={index} to={item.path}>
                                  <motion.div
                                    whileHover={{
                                      y: -3,
                                      scale: 1.02,
                                    }}
                                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-4 hover:border-blue-300 hover:shadow-xl transition-all"
                                  >
                                    <div className="relative flex items-center justify-between">
                                      <span className="font-semibold text-gray-800 text-[15px]">
                                        {item.title}
                                      </span>

                                      <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-all">
                                        <ChevronDown className="-rotate-90 w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                                      </div>
                                    </div>
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
              <div className="hidden lg:flex flex-1 max-w-2xl relative z-[9999]">
                <div className="relative w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    onFocus={() => {
                      if (search.trim()) {
                        setSearchOpen(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(search);
                      }
                    }}
                    placeholder="Cari layanan atau retribusi..."
                    className="w-full pl-14 pr-24 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />

                  {/* BUTTON SEARCH */}
                  <button
                    onClick={() => handleSearch(search)}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-semibold hover:text-blue-700"
                  >
                    Cari
                  </button>

                  {/* CLEAR */}
                  {search && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setSearchResults([]);
                        setSearchOpen(false);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <XCircle className="w-5 h-5 text-gray-400 hover:text-red-500 transition-all" />
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="relative group hidden md:block">
                    <button className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-100 transition-all">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold shadow">
                        {user?.nama?.charAt(0) || "U"}
                      </div>

                      <div className="hidden lg:block text-left">
                        <p className="font-semibold text-sm text-gray-800">
                          {user?.nama || "User"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {user?.email || "-"}
                        </p>
                      </div>
                    </button>
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
        </header>

        {/* SEARCH RESULT */}
        <AnimatePresence>
          {searchOpen && search.trim() && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="max-w-7xl mx-auto mt-4 rounded-[28px] border border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden relative z-[9000]"
            >
              {/* HEADER */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Hasil Pencarian
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {searchResults.length} data ditemukan
                  </p>
                </div>

                {loadingSearch && (
                  <div className="text-sm text-blue-600 font-medium">
                    Loading...
                  </div>
                )}
              </div>

              {/* EMPTY */}
              {!loadingSearch && searchResults.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-gray-500">Tidak ada data ditemukan</p>
                </div>
              )}

              {/* LIST */}
              <div className="max-h-[75vh] overflow-y-auto p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {searchResults.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      whileHover={{
                        scale: 1.01,
                      }}
                      onClick={() =>
                        navigate(`/detail-retribusi/${item.id}`, {
                          state: item,
                        })
                      }
                      className="cursor-pointer rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl transition-all p-4"
                    >
                      <div className="flex gap-4">
                        {/* FOTO */}
                        <div className="w-32 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                          {item?.foto ? (
                            <img
                              src={item?.foto}
                              alt={item?.obyek_retribusi}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-10 h-10 text-white/70" />
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 min-w-0">
                          {/* NAMA */}
                          <h3 className="font-bold text-gray-800 text-sm line-clamp-2">
                            {item?.obyek_retribusi || "-"}
                          </h3>

                          {/* OPD */}
                          <p className="text-xs text-blue-600 mt-1 line-clamp-1">
                            {item?.opd?.nama || "-"}
                          </p>

                          {/* KOTA */}
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />

                            <span className="truncate">
                              {item?.kota?.kab_kota || "-"}
                            </span>
                          </div>

                          {/* TARIF */}
                          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-green-600">
                            <Wallet className="w-3.5 h-3.5" />

                            <span>
                              Rp{" "}
                              {Number(
                                item?.tariftbl?.tarif || 0,
                              ).toLocaleString("id-ID")}
                              {" / "}
                              {item?.tariftbl?.satuan?.satuan || "-"}
                            </span>
                          </div>

                          {/* BUTTON */}
                          <button className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-all">
                            Lihat Detail →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
