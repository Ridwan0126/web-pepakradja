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
    <div className="w-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Layanan Cepat</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {services.map((service) => {
          const Icon = service.icon
          const isActive = service.status === 'active'
          
          return (
            <Link
              key={service.id}
              to={service.link}
              className={`group relative overflow-hidden rounded-lg p-3 transition-smooth ${
                isActive ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-60'
              }`}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              />

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-smooth flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {service.title}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">{service.subtitle}</p>
                </div>

                {isActive && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded flex-shrink-0">
                    Aktif
                  </span>
                )}

                {!isActive && (
                  <span className="text-xs font-semibold text-gray-400 flex-shrink-0">
                    Soon
                  </span>
                )}
              </div>

              {/* Hover Border */}
              <div className="absolute inset-0 border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
