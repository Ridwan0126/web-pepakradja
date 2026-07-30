"use client"

import BannerSlider from "../components/organisms/BannerSlider"
import Hero from "../components/organisms/Hero"
import QuickAccessSection from "../components/organisms/QuickAccessSection"
import FeaturedObjectsSection from "../components/organisms/FeaturedObjectsSection"
import AboutSection from "../components/organisms/AboutSection"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Banner Slider */}
      <BannerSlider />

      {/* Hero Section */}
      <Hero />

      {/* Quick Access Section */}
      <QuickAccessSection />

      {/* Featured Objects Section */}
      <FeaturedObjectsSection />

      {/* About Section */}
      <AboutSection />
    </div>
  )
}
