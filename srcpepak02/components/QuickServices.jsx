import { FileText, Download, Receipt, Flag, Users, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function QuickServices() {
  const services = [
    {
      id: 1,
      icon: FileText,
      title: 'Obyek Retribusi',
      subtitle: 'Daftar Lengkap',
      count: '1000+',
      color: 'from-blue-400 to-blue-600',
      status: 'active',
      link: '/products',
    },
    {
      id: 2,
      icon: Download,
      title: 'Bukti Bayar',
      subtitle: 'Download',
      count: '5000+',
      color: 'from-purple-400 to-purple-600',
      status: 'active',
      link: '/transactions',
    },
    {
      id: 3,
      icon: Receipt,
      title: 'SPTRD',
      subtitle: 'Permohonan',
      count: 'N/A',
      color: 'from-pink-400 to-pink-600',
      status: 'coming',
      link: '#',
    },
    {
      id: 4,
      icon: Flag,
      title: 'SKPD/SKRD',
      subtitle: 'Penetapan Ulang',
      count: 'N/A',
      color: 'from-green-400 to-green-600',
      status: 'coming',
      link: '#',
    },
    {
      id: 5,
      icon: Users,
      title: 'PAP',
      subtitle: 'Pendaftaran WP',
      count: 'N/A',
      color: 'from-orange-400 to-orange-600',
      status: 'coming',
      link: '#',
    },
    {
      id: 6,
      icon: AlertCircle,
      title: 'NPWPD',
      subtitle: 'Penerbitan',
      count: 'N/A',
      color: 'from-red-400 to-red-600',
      status: 'coming',
      link: '#',
    },
  ]

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Layanan Cepat</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((service) => {
            const Icon = service.icon
            const isActive = service.status === 'active'
            
            return (
              <Link
                key={service.id}
                to={service.link}
                className={`group relative overflow-hidden rounded-xl p-4 transition-smooth hover:shadow-xl ${
                  isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-smooth group-hover:scale-110`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">{service.subtitle}</p>

                  {isActive && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                      {service.count}
                    </span>
                  )}

                  {!isActive && (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                      Segera
                    </span>
                  )}
                </div>

                {/* Hover Border */}
                <div className="absolute inset-0 border-2 border-gray-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
