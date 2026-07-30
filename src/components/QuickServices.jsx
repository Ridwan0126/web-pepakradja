import {
  FileText,
  Download,
  Receipt,
  Flag,
  Users,
  AlertCircle,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function QuickServices() {
  const navigate = useNavigate();

  const session = JSON.parse(localStorage.getItem("wr_session") || "{}");

  const isLoggedIn =
    session?.isLoggedIn === true && session?.expiredAt > Date.now();

  const handleServiceClick = (service, e) => {
    if (service.status === "coming") {
      e.preventDefault();
      return;
    }

    if (service.requireLogin && !isLoggedIn) {
      e.preventDefault();

      Swal.fire({
        icon: "warning",
        title: "Anda perlu Masuk",
        text: "Silakan Masuk terlebih dahulu untuk mengakses layanan ini.",
        confirmButtonText: "Masuk",
        showCancelButton: true,
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  const services = [
    // {
    //   id: 2,
    //   icon: Download,
    //   title: "Bukti Pembayaran",
    //   count: "Unduh",
    //   color: "from-violet-500 to-purple-500",
    //   status: "active",
    //   link: "/transactions",
    //   requireLogin: true,
    // },
    {
      id: 3,
      icon: Receipt,
      title: "Perjanjian",
      count: "Tersedia",
      color: "from-pink-500 to-rose-500",
      status: "active",
      link: "/sptrd",
      requireLogin: true,
    },
    {
      id: 4,
      icon: Flag,
      title: "Ketetapan Retribusi",
      count: "Unduh",
      color: "from-emerald-500 to-green-500",
      status: "active",
      link: "/skrd",
      requireLogin: true,
    },
    {
      id: 5,
      icon: Users,
      title: "Layanan PAP",
      count: "Segera Hadir",
      color: "from-orange-500 to-amber-500",
      status: "coming",
      link: "#",
    },
    // {
    //   id: 6,
    //   icon: AlertCircle,
    //   title: "NPWRD/NPWPD",
    //   count: "Segera Hadir",
    //   color: "from-red-500 to-pink-500",
    //   status: "coming",
    //   link: "#",
    // },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3.5">
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = service.status === "active";
          const isComing = service.status === "coming";
          const isLocked = service.requireLogin && !isLoggedIn;

          return (
            <Link
              key={service.id}
              to={service.link}
              onClick={(e) => handleServiceClick(service, e)}
              className="group relative mt-2 overflow-hidden rounded-2xl border border-white/50 bg-white/30 backdrop-blur-2xl backdrop-saturate-150 p-3.5 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:bg-white/50 hover:border-2 hover:border-green-500 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              {/* Ambient background glow */}
              <div
                className={`absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06] bg-gradient-to-br ${service.color}`}
              />

              <div className="relative flex items-center gap-3 w-full">
                {/* Icon Wrapper */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-m font-extrabold text-slate-800 font-sans tracking-tight truncate group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h4>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[10px] font-bold tracking-wide uppercase ${
                        isActive ? "text-slate-500" : "text-orange-500"
                      }`}
                    >
                      {service.count}
                    </span>

                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          : "bg-orange-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Pojok kanan default (sebelum hover) */}
                <div className="flex items-center justify-center flex-shrink-0 z-0">
                  {isActive && !isLocked && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:opacity-0 transition-opacity" />
                  )}
                  {isLocked && (
                    <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:opacity-0 transition-opacity" />
                  )}
                </div>
              </div>

              {/* DIUBAH: OVERLAY 1 - Muncul jika layanan AKTIF & TIDAK TERKUNCI (Memunculkan panah melayang di tengah ala iOS) */}
              {/* {isActive && !isLocked && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-200/60 shadow-md flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <ArrowUpRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              )} */}

              {/* OVERLAY 2: Muncul jika statusnya TERKUNCI/LOCKED saat hover */}
              {isLocked && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-200/60 shadow-md flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Lock className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              )}

              {/* OVERLAY 3: Muncul jika statusnya COMING SOON saat hover */}
              {isComing && (
                <div className="absolute inset-0 bg-red-300/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-end z-10">
                  <div className="px-4 py-1.5 mr-4 rounded-full bg-white border border-gray-200/60 shadow-md flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <span className="text-xs font-black text-red-500 tracking-tight font-sans uppercase">
                      Segera Hadir
                    </span>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
