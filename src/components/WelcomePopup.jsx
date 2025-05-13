"use client"

import { useEffect, useState, useRef } from "react"
import "../styles/WelcomePopup.css"
import popupImage from "../assets/join & follow.png"

const WelcomePopup = () => {
  const [show, setShow] = useState(false)
  const [closing, setClosing] = useState(false)
  const overlayRef = useRef(null)
  const popupRef = useRef(null)

  useEffect(() => {
    // Tampilkan popup dengan delay kecil untuk animasi
    const timer = setTimeout(() => {
      setShow(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (show) {
      // Mencegah scrolling pada body saat popup terbuka
      document.body.style.overflow = "hidden"

      // Tambahkan event listener untuk scroll pada overlay
      const handleScroll = (e) => {
        // Mencegah event scroll default pada body
        e.stopPropagation()
      }

      const overlay = overlayRef.current
      if (overlay) {
        overlay.addEventListener("wheel", handleScroll, { passive: false })
      }

      return () => {
        if (overlay) {
          overlay.removeEventListener("wheel", handleScroll)
        }
      }
    } else {
      // Mengembalikan scrolling pada body saat popup ditutup
      document.body.style.overflow = "auto"
    }

    return () => {
      // Cleanup: pastikan scrolling dikembalikan saat komponen unmount
      document.body.style.overflow = "auto"
    }
  }, [show])

  const closePopup = () => {
    // Aktifkan animasi closing
    setClosing(true)

    // Tunggu animasi selesai baru benar-benar menutup popup
    setTimeout(() => {
      setShow(false)
      setClosing(false)
    }, 500) // Sesuaikan dengan durasi animasi di CSS
  }

  const handleOverlayClick = (e) => {
    // Tutup popup saat mengklik area overlay (luar popup)
    if (!popupRef.current?.contains(e.target) || e.target.classList.contains("popup-overlay")) {
      closePopup()
    }
  }

  if (!show && !closing) return null

  return (
    <div className={`popup-overlay ${closing ? "closing" : ""}`} onClick={handleOverlayClick} ref={overlayRef}>
      <div className="popup-wrapper">
        <div className={`popup-container ${closing ? "closing" : ""}`} ref={popupRef}>
          <button className="popup-close" onClick={closePopup} aria-label="Close">
            <span className="close-icon">×</span>
          </button>
          <div className="popup-content">
            <a href="https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR" target="_blank" rel="noopener noreferrer">
              <img src={popupImage || "/placeholder.svg"} alt="Join & Follow Us" className="popup-image" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePopup
