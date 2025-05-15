"use client"

import { useState, useEffect } from "react"
import { Form, Button } from "react-bootstrap"
import bgRedeemPage from "../assets/Redeem/background.png"
import bgRedeemFormAndLogo from "../assets/Redeem/1.png"
import bgRedeemMobile from "../assets/Redeem/2.png"
import axios from "axios"

function RedeemPage() {
  const [pinCode, setPinCode] = useState("")
  const [idGame, setIdGame] = useState("")
  const [nama, setNama] = useState("")
  const [error, setError] = useState({
    emptyFields: false,
    invalidPin: false,
    usedPin: false,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      setIsMobile(width <= 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const emptyFields = !pinCode || !idGame || !nama
    if (emptyFields) {
      setError({
        emptyFields: true,
        invalidPin: false,
        usedPin: false,
      })
      return
    }

    setIsLoading(true)
    try {
      // Gunakan environment variable untuk API URL
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
      // Pastikan API_URL tidak memiliki trailing slash
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      
      const response = await axios.post(`${baseUrl}/api/pin/redeem`, {
        pinCode,
        idGame,
        nama,
      }, {
        // Tambahkan header CORS
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Aktifkan withCredentials untuk mengirim cookies
        withCredentials: true
      })

      if (response.data.message === "Redeem berhasil") {
        // Gunakan environment variable untuk nomor WhatsApp
        const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "6285709346954"
        const formattedPhone = phoneNumber.replace(/-/g, "").replace(/\s/g, "")
        const message = `*Saya ingin meredeem giftcard dengan keterangan*\nPIN Code: ${pinCode}\nID Game: ${idGame}\nNama: ${nama}`
        window.location.href = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || "Terjadi kesalahan server"

      setError({
        emptyFields: false,
        invalidPin: errMsg === "PIN code tidak ditemukan",
        usedPin: errMsg === "PIN code sudah digunakan",
      })
      if (errMsg !== "PIN code tidak ditemukan" && errMsg !== "PIN code sudah digunakan") {
        alert("Terjadi kesalahan server. Coba lagi nanti.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="redeem-page w-100 min-vh-100"
      style={{
        backgroundImage: `url(${bgRedeemPage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "20px 0" : "0",
      }}
    >
      <div
        className="redeem-container"
        style={{
          backgroundImage: `url(${isMobile ? bgRedeemMobile : bgRedeemFormAndLogo})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: isMobile ? "100%" : "90%",
          maxWidth: isMobile ? "450px" : "1000px",
          height: isMobile ? "1200px" : "500px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: isMobile ? "flex-end" : "center",
        }}
      >
        <div
          className="form-side"
          style={{
            width: isMobile ? "85%" : "35%",
            position: "absolute",
            left: isMobile ? "50%" : "25%",
            top: windowWidth <= 768 ? "auto" : windowWidth <= 992 ? "53%" : "50%",
            bottom: isMobile ? "70px" : "auto",
            transform: isMobile ? "translateX(-50%)" : "translate(-50%, -50%)",
            padding: "0",
          }}
        >
          <h1
            style={{
              fontSize: windowWidth <= 320 ? "1.5rem" : windowWidth <= 992 ? "1.5rem" : "2.2rem",
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
              color: "#000",
            }}
          >
            {windowWidth <= 768 ? (
              "Redeem your tokens now!"
            ) : (
              <>
                Redeem your
                <br />
                tokens now!
              </>
            )}
          </h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="PIN code"
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value)
                  setError({
                    emptyFields: false,
                    invalidPin: false,
                    usedPin: false,
                  })
                }}
                style={{
                  padding: windowWidth <= 320 ? "10px 15px" : "12px 20px",
                  borderRadius: "30px",
                  border: "none",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  fontSize: windowWidth <= 320 ? "0.9rem" : "1rem",
                }}
              />
              {error.invalidPin && !error.emptyFields && (
                <p className="error-message" style={{ color: "red", fontSize: "0.8rem", marginLeft: "10px" }}>
                  *PIN code tidak valid
                </p>
              )}
              {error.usedPin && !error.emptyFields && !error.invalidPin && (
                <p className="error-message" style={{ color: "red", fontSize: "0.8rem", marginLeft: "10px" }}>
                  *PIN code sudah pernah digunakan
                </p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="ID game"
                value={idGame}
                onChange={(e) => setIdGame(e.target.value)}
                style={{
                  padding: windowWidth <= 320 ? "10px 15px" : "12px 20px",
                  borderRadius: "30px",
                  border: "none",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  fontSize: windowWidth <= 320 ? "0.9rem" : "1rem",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                style={{
                  padding: windowWidth <= 320 ? "10px 15px" : "12px 20px",
                  borderRadius: "30px",
                  border: "none",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  fontSize: windowWidth <= 320 ? "0.9rem" : "1rem",
                }}
              />
            </Form.Group>

            {error.emptyFields && (
              <p
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  marginBottom: "10px",
                  marginLeft: "10px",
                  marginTop: "-5px",
                }}
              >
                *Semua kolom harus diisi terlebih dahulu
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: windowWidth <= 320 ? "10px" : "12px",
                borderRadius: "30px",
                backgroundColor: "#F9A826",
                border: "none",
                fontWeight: "bold",
                marginTop: "10px",
                fontSize: windowWidth <= 320 ? "0.9rem" : "1rem",
              }}
            >
              {isLoading ? "Processing..." : "Submit"}
            </Button>

            <p
              className="form-side-note"
              style={{
                color: "white",
                fontSize: windowWidth <= 320 ? "0.7rem" : windowWidth <= 992 ? "0.8rem" : "1rem",
                marginTop: "15px",
                textAlign: "center",
                textShadow: "0px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {windowWidth <= 992 ? (
                "*pastikan semua yang dimasukkan sudah benar termasuk PIN code"
              ) : (
                <>
                  *pastikan semua yang dimasukkan
                  <br />
                  sudah benar terutama PIN code
                </>
              )}
            </p>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default RedeemPage
