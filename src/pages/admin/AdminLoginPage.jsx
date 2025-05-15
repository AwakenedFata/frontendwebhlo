"use client";

import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import "../../styles/adminstyles.css";

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    setLoading(true);
    try {
      // Pastikan API_URL tidak memiliki trailing slash
      const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
      console.log("Attempting login to:", `${baseUrl}/api/auth/login`);

      const response = await axios.post(
        `${baseUrl}/api/auth/login`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Aktifkan withCredentials untuk mengirim cookies
          withCredentials: true,
        }
      );
      console.log("Login response:", response.data);

      sessionStorage.setItem("adminToken", response.data.token);
      sessionStorage.setItem("adminUsername", username);

      // Simpan foto profil jika ada
      if (response.data.admin && response.data.admin.profileImage) {
        const profileImageUrl = `${API_URL}${response.data.admin.profileImage}`;
        sessionStorage.setItem("adminProfileImage", profileImageUrl);
      }

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Card.Body>
          <h2>Admin Login</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                autoComplete="username"
                className="form-control-lg"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="new-password"
                className="form-control-lg"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 py-2 mt-2"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminLoginPage;
