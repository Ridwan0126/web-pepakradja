import Navbar from "../organisms/Navbar"
import Footer from "../organisms/Footer"

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen modern-gradient relative">
      {/* Floating decorative elements */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>

      <Navbar />
      <div className="pt-24 pb-12 relative z-10">{children}</div>
      <Footer />
    </div>
  )
}
