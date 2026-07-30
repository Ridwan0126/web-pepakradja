import { useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSlider from '../components/HeroSlider'
import QuickMenu from '../components/QuickMenu'
import FilterSection from '../components/FilterSection'
import ObyekList from '../components/ObyekList'
import Footer from '../components/Footer'

export default function HomePage() {
  const [filters, setFilters] = useState(null)

  const handleFilter = (filterData) => {
    setFilters(filterData)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Slider */}
        <HeroSlider />
        
        {/* Quick Menu */}
        <QuickMenu />
        
        {/* Filter Section */}
        <FilterSection onFilter={handleFilter} />
        
        {/* Obyek List */}
        <ObyekList filters={filters} />
      </main>

      <Footer />
    </div>
  )
}
