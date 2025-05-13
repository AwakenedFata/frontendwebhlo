"use client"

import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import NavbarComponent from "./components/NavbarComponent"
import WelcomePopup from "./components/WelcomePopup"
import FooterComponent from "./components/FooterComponent"
import HomePage from "./pages/HomePage"
import AboutUsPage from "./pages/AboutUsPage"
import GalleryPage from "./pages/GalleryPage"
import PartnersPage from "./pages/PartnersPage"
import PlatformsPage from "./pages/PlatformsPage"
import RedeemPage from "./pages/RedeemPage"
import MerchanPage from "./pages/MerchanPage"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import PinManagement from "./pages/admin/PinManagement"
import Dashboard from "./pages/admin/Dashboard"
import RedemptionHistory from "./pages/admin/RedemptionHistory"
import AdminLayout from "./components/admin/AdminLayout"

function App() {
  const location = useLocation()
  const [showPopup, setShowPopup] = useState(false)

  // Cek apakah sedang di route admin
  const isAdminRoute = location.pathname.startsWith("/admin")

  // Cek apakah sedang di halaman home (path "/" exact)
  const isHomePage = location.pathname === "/"

  useEffect(() => {
    // Fungsi untuk menandai navigasi antar halaman
    const markNavigation = () => {
      // Simpan path terakhir di sessionStorage
      sessionStorage.setItem("lastPath", location.pathname)
    }

    // Ketika komponen di-mount, cek apakah ini adalah load pertama atau navigasi
    const handleInitialLoad = () => {
      // Ambil path terakhir dari sessionStorage
      const lastPath = sessionStorage.getItem("lastPath")

      // Jika di halaman home
      if (isHomePage) {
        // Jika tidak ada lastPath (pertama kali load) atau lastPath adalah home juga (refresh)
        if (!lastPath || lastPath === "/") {
          setShowPopup(true)
        } else {
          // Jika ada lastPath dan bukan home, berarti navigasi dari halaman lain
          setShowPopup(false)
        }
      } else {
        setShowPopup(false)
      }

      // Simpan path saat ini untuk navigasi berikutnya
      markNavigation()
    }

    handleInitialLoad()

    // Cleanup function tidak diperlukan karena kita hanya menjalankan kode sekali
  }, [isHomePage, location.pathname])

  return (
    <div>
      {!isAdminRoute && <NavbarComponent />}

      {/* Tampilkan WelcomePopup hanya jika showPopup true */}
      {showPopup && <WelcomePopup />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/platforms" element={<PlatformsPage />} />
        <Route path="/redeem" element={<RedeemPage />} />
        <Route path="/merchan" element={<MerchanPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pins" element={<PinManagement />} />
          <Route path="redemption-history" element={<RedemptionHistory />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>

      {!isAdminRoute && <FooterComponent />}
    </div>
  )
}

export default App
