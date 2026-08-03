import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

export default function QuickServices() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    try {
      const rawSession = localStorage.getItem("wr_session");
      if (!rawSession) {
        setIsAuthenticated(false);
        return;
      }
      
      const session = JSON.parse(rawSession);
      const isLogged = Boolean(session?.isLoggedIn === true && session?.user?.id);
      setIsAuthenticated(isLogged);
    } catch (error) {
      console.error("Gagal parsing wr_session:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleServiceClick = (service) => {
    if (service.status === "coming") {
      return;
    }

    console.log(session);
console.log("LOGIN ?", session?.isLoggedIn);
console.log("USER ID ?", session?.user?.id);

    // Pengecekan langsung secara live saat tombol diklik
    const rawSession = localStorage.getItem("wr_session");
    const session = rawSession ? JSON.parse(rawSession) : {};
    const currentIsLogged = Boolean(session?.isLoggedIn === true && session?.user?.id);

    if (service.requireLogin && !currentIsLogged) {
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
    } else {
      navigate(service.link);
    }
  };

  const services = [
    {
      id: 3,
      icon: Receipt,
      title: "Permohonan / SPTRD Online",
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
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3.5">
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = service.status === "active";
          const isComing = service.status === "coming";
          
          const rawSession = typeof window !== "undefined" ? localStorage.getItem("wr_session") : null;
          const session = rawSession ? JSON.parse(rawSession) : {};
          const liveAuth = Boolean(session?.isLoggedIn === true && session?.user?.id);
          const isLocked = service.requireLogin && !liveAuth;

          return (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className="group relative mt-2 overflow-hidden rounded-2xl border border-white/50 bg-white/30 backdrop-blur-2xl backdrop-saturate-150 p-3.5 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:bg-white/50 hover:border-2 hover:border-green-500 hover:-translate-y-0.5 flex flex-col justify-between cursor-pointer"
            >
              <div
                className={`absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06] bg-gradient-to-br ${service.color}`}
              />

              <div className="relative flex items-center gap-3 w-full">
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>

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

                <div className="flex items-center justify-center flex-shrink-0 z-0">
                  {isActive && !isLocked && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:opacity-0 transition-opacity" />
                  )}
                  {isLocked && (
                    <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:opacity-0 transition-opacity" />
                  )}
                </div>
              </div>

              {isLocked && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-200/60 shadow-md flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Lock className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              )}

              {isComing && (
                <div className="absolute inset-0 bg-red-300/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-end z-10">
                  <div className="px-4 py-1.5 mr-4 rounded-full bg-white border border-gray-200/60 shadow-md flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <span className="text-xs font-black text-red-500 tracking-tight font-sans uppercase">
                      Segera Hadir
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}