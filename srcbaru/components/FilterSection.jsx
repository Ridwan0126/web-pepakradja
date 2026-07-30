import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Filter, ChevronDown } from 'lucide-react'
import { KABUPATEN_KOTA, JENIS_RETRIBUSI } from '../config'

export default function FilterSection({ onFilter }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWilayah, setSelectedWilayah] = useState('')
  const [selectedJenis, setSelectedJenis] = useState('')

  const handleFilter = () => {
    onFilter?.({
      search: searchQuery,
      wilayah: selectedWilayah,
      jenis: selectedJenis,
    })
  }

  const handleReset = () => {
    setSearchQuery('')
    setSelectedWilayah('')
    setSelectedJenis('')
    onFilter?.({
      search: '',
      wilayah: '',
      jenis: '',
    })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 lg:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl lg:rounded-3xl shadow-lg border border-border p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Filter Pencarian</h2>
              <p className="text-sm text-muted-foreground">Temukan obyek retribusi sesuai kebutuhan</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama obyek, lokasi, atau jenis retribusi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Wilayah */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select
                value={selectedWilayah}
                onChange={(e) => setSelectedWilayah(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-muted rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {KABUPATEN_KOTA.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Jenis Retribusi */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select
                value={selectedJenis}
                onChange={(e) => setSelectedJenis(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-muted rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {JENIS_RETRIBUSI.map((jenis) => (
                  <option key={jenis.id} value={jenis.id}>
                    {jenis.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFilter}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <Search className="w-5 h-5" />
              Cari Sekarang
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="px-6 py-3.5 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
            >
              Reset
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
