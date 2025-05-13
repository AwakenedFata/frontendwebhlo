"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link, Outlet } from "react-router-dom"
import { FaChartPie, FaKey, FaHistory, FaSignOutAlt, FaBars, FaTimes, FaCamera } from "react-icons/fa"
import axios from "axios"
import "../../styles/adminstyles.css"
import { API_URL } from "../../config"

function AdminLayout() {
  const navigate = useNavigate()
  const adminUsername = sessionStorage.getItem("adminUsername")
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [profileImage, setProfileImage] = useState(
    sessionStorage.getItem("adminProfileImage") || "/src/assets/Join & Follow/logo.png",
  )
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  useEffect(() => {
    // Check if admin is logged in
    const token = sessionStorage.getItem("adminToken")
    if (!token) {
      navigate("/admin/login")
      return
    }

    // Fetch profile image from backend
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profile/image`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success && response.data.data.profileImage) {
          const imageUrl = `${API_URL}${response.data.data.profileImage}`
          setProfileImage(imageUrl)
          sessionStorage.setItem("adminProfileImage", imageUrl)
        }
      } catch (error) {
        console.error("Error fetching profile image:", error)
      }
    }

    fetchProfileImage()

    // Handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarVisible(false)
      } else {
        setSidebarVisible(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken")
    sessionStorage.removeItem("adminUsername")
    sessionStorage.removeItem("adminProfileImage")
    navigate("/admin/login")
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadLoading(true)
    setUploadError("")

    try {
      const token = sessionStorage.getItem("adminToken")
      const formData = new FormData()
      formData.append("profileImage", file)

      const response = await axios.post(`${API_URL}/api/profile/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        const imageUrl = `${API_URL}${response.data.data.profileImage}`
        setProfileImage(imageUrl)
        sessionStorage.setItem("adminProfileImage", imageUrl)
        setShowProfileModal(false)
      }
    } catch (error) {
      console.error("Error uploading profile image:", error)
      setUploadError(error.response?.data?.message || "Gagal mengunggah foto profil")
    } finally {
      setUploadLoading(false)
    }
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarVisible ? "show" : ""}`}>
        <div className="border-bottom">
          <img src="/src/assets/logo footter.png" alt="Logo" width="100" height="32" />
        </div>
        <ul className="nav flex-column p-3">
          <li className="nav-item">
            <Link to="/admin/dashboard" className="nav-link d-flex align-items-center">
              <FaChartPie className="me-2" /> Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/pins" className="nav-link d-flex align-items-center">
              <FaKey className="me-2" /> Manajemen PIN
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/redemption-history" className="nav-link d-flex align-items-center">
              <FaHistory className="me-2" /> Riwayat Redemption
            </Link>
          </li>
          <li className="nav-item mt-5">
            <button onClick={handleLogout} className="nav-link d-flex align-items-center border-0 bg-transparent w-100">
              <FaSignOutAlt className="me-2" /> Logout
            </button>
          </li>
        </ul>
        {adminUsername && (
          <div className="mt-auto p-3 border-top profile-section">
            <div className="d-flex align-items-center justify-content-center flex-column">
              <div className="profile-image-container mb-2" onClick={() => setShowProfileModal(true)}>
                <img src={profileImage || "/placeholder.svg"} alt="Profile" className="profile-image" />
                <div className="profile-image-overlay">
                  <FaCamera className="camera-icon" />
                </div>
              </div>
              <small className="d-block text-center">
                <strong>{adminUsername}</strong>
              </small>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="content">
        <button className="btn btn-sm btn-primary d-md-none mb-3" onClick={toggleSidebar}>
          {sidebarVisible ? <FaTimes /> : <FaBars />}
        </button>
        <Outlet />
      </div>
      {/* Profile Image Modal */}
      {showProfileModal && (
        <div className="profile-modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h5>Update Profile Picture</h5>
              <button className="btn-close" onClick={() => setShowProfileModal(false)}></button>
            </div>
            <div className="profile-modal-body">
              <div className="current-profile-container mb-3">
                <img src={profileImage || "/placeholder.svg"} alt="Current Profile" className="current-profile-image" />
              </div>
              {uploadError && <div className="alert alert-danger">{uploadError}</div>}
              <div className="mb-3">
                <label htmlFor="profileImageInput" className="form-label">
                  Choose new image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="profileImageInput"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  disabled={uploadLoading}
                />
              </div>
            </div>
            <div className="profile-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowProfileModal(false)} disabled={uploadLoading}>
                {uploadLoading ? "Uploading..." : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
