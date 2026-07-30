"use client"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { DataProvider } from "./contexts/DataContext"
import { useEffect, useState } from "react"

// Import components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SplashScreen from "./components/SplashScreen"
import FloatingActionButton from "./components/FloatingActionButton"
import HomePage from "./pages/HomePage"
import ObjectsPage from "./pages/ObjectsPage"
import ObjectDetailPage from "./pages/ObjectDetailPage"
import DownloadPaymentProofPage from "./pages/DownloadPaymentProofPage"
import RetribusiDetailPage from "./pages/RetribusiDetailPage"
import PAPDetailPage from "./pages/PAPDetailPage"
import PABDetailPage from "./pages/PABDetailPage"
import AboutUsPage from "./pages/AboutUsPage"
import ComingSoonPage from "./pages/ComingSoonPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import AdminContactEditPage from "./pages/AdminContactEditPage"
import AdminContactListPage from "./pages/AdminContactListPage"
import ContactManagementPage from "./pages/ContactManagementPage"
import UserManagementPage from "./pages/UserManagementPage"
import SettingsPage from "./pages/SettingsPage"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function Layout({ children }) {
  const location = useLocation()
  const hideNavbarFooter =
    location.pathname.startsWith("/admin/login") ||
    location.pathname.startsWith("/admin/contact") ||
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/admin/users") ||
    location.pathname.startsWith("/admin/settings") ||
    location.pathname.startsWith("/admin/contact-management") ||
    location.pathname === "/admin"

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbarFooter && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideNavbarFooter && <Footer />}
      {!hideNavbarFooter && <FloatingActionButton />}
    </div>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(false) // Changed from true to false - don't show splash on initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("showSplash", "true")
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && sessionStorage.getItem("showSplash") === "true") {
        setShowSplash(true)
        sessionStorage.removeItem("showSplash")
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isInitialLoad])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setIsInitialLoad(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/obyek" element={<ObjectsPage />} />
              <Route path="/obyek/:id" element={<ObjectDetailPage />} />
              <Route path="/unduh-bukti-bayar" element={<DownloadPaymentProofPage />} />
              <Route path="/unduh-bukti-bayar/retribusi/:id" element={<RetribusiDetailPage />} />
              <Route path="/unduh-bukti-bayar/pap/:id" element={<PAPDetailPage />} />
              <Route path="/unduh-bukti-bayar/pab/:id" element={<PABDetailPage />} />
              <Route path="/tentang-kami" element={<AboutUsPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/contacts" element={<AdminContactListPage />} />
              <Route path="/admin/contacts/add" element={<AdminContactEditPage />} />
              <Route path="/admin/contacts/edit/:id" element={<AdminContactEditPage />} />
              <Route path="/admin/contacts/view/:id" element={<AdminContactEditPage />} />
              <Route path="/admin/contact/edit/:id" element={<AdminContactEditPage />} />
              <Route path="/admin/contact/detail/:id" element={<AdminContactEditPage />} />
              <Route path="/admin/contact-management" element={<ContactManagementPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/coming-soon" element={<ComingSoonPage />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </DataProvider>
  )
}

export default App
