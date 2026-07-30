"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import MainLayout from "./components/templates/MainLayout"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import ObjectsPage from "./pages/ObjectsPage"
import ObjectDetailPage from "./pages/ObjectDetailPage"
import PaymentReceiptsPage from "./pages/PaymentReceiptsPage"
import ComingSoonPage from "./pages/ComingSoonPage"
import "./styles/globals.css"

// ScrollToTop component to handle route changes
function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    console.log("🔄 Route changed to:", location.pathname, "- scrolling to top")
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [location.pathname])

  return null
}

function App() {
  // Global scroll to top handler for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      console.log("🔄 Browser navigation - scrolling to top")
      window.scrollTo({ top: 0, behavior: "instant" })
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/objects" element={<ObjectsPage />} />
            <Route path="/objects/:id" element={<ObjectDetailPage />} />
            <Route path="/payment-receipts" element={<PaymentReceiptsPage />} />
            <Route path="/coming-soon" element={<ComingSoonPage />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  )
}

export default App
