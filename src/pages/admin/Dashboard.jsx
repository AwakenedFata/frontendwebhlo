import { useState, useEffect, useCallback } from "react";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import '../../styles/adminstyles.css'

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    used: 0,
    unused: 0,
    batches: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
      setError("Gagal mengambil data statistik");
    } finally {
      setLoading(false);
    }
  }, [navigate]); 

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Custom chart colors - futuristic theme
  const chartColors = {
    primary: ["#6c63ff", "#4facfe"],
    secondary: ["#00f5a0", "#00d9f5"],
    accent: ["#ff6b6b", "#ff8e53"],
    background: "#16213e",
    text: "#ffffff",
    grid: "rgba(255, 255, 255, 0.43)",
  }

  // Common chart options
  const commonOptions = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: chartColors.text,
          font: {
            family: "'Nasalization', 'Overpass', sans-serif",
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "rectRounded",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(22, 33, 62, 0.8)",
        titleColor: chartColors.text,
        bodyColor: chartColors.text,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "'Nasalization', 'Overpass', sans-serif",
        },
        titleFont: {
          family: "'Nasalization', 'Overpass', sans-serif",
          weight: "bold",
        },
        displayColors: true,
        boxPadding: 5,
      },
    },
  }

  // Data untuk pie chart
  const pieData = {
    labels: ["Digunakan", "Belum Digunakan"],
    datasets: [
      {
        data: [stats.used, stats.unused],
        backgroundColor: [chartColors.accent[0], chartColors.primary[0]],
        hoverBackgroundColor: [chartColors.accent[1], chartColors.primary[1]],
        borderColor: chartColors.background,
        borderWidth: 2,
      },
    ],
  }

  // Options for pie chart
  const pieChartOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        color: chartColors.text,
        font: {
          family: "'Nasalization', 'Overpass', sans-serif",
          size: 16,
          weight: "bold",
        },
      },
    },
    maintainAspectRatio: false,
  }

  // Data untuk bar chart
  const barData = {
    labels: stats.batches.map((batch) => batch.name || `Batch ${batch.id}`),
    datasets: [
      {
        label: "Jumlah PIN",
        data: stats.batches.map((batch) => batch.count),
        backgroundColor: (context) => {
          const index = context.dataIndex
          const value = context.dataset.data[index]
          const alpha = 0.7 + (value / Math.max(...context.dataset.data)) * 0.3
          return `rgba(108, 99, 255, ${alpha})`
        },
        borderColor: chartColors.primary[1],
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: chartColors.primary[1],
      },
    ],
  }

  // Options for bar chart
  const barOptions = {
    ...commonOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        color: chartColors.text,
        font: {
          family: "'Nasalization', 'Overpass', sans-serif",
          size: 16,
          weight: "bold",
        },
      },
      legend: {
        ...commonOptions.plugins.legend,
        labels: {
          ...commonOptions.plugins.legend.labels,
          color: chartColors.secondary[0], // Custom color for "Jumlah PIN" label
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: chartColors.grid,
          borderColor: chartColors.grid,
          tickColor: chartColors.grid,
        },
        ticks: {
          color: chartColors.text,
          font: {
            family: "'Nasalization', 'Overpass', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: chartColors.grid,
          borderColor: chartColors.grid,
          tickColor: chartColors.grid,
        },
        ticks: {
          color: chartColors.text,
          font: {
            family: "'Nasalization', 'Overpass', sans-serif",
          },
          callback: (value) => {
            if (value % 1 === 0) {
              return value
            }
            return null
          },
        },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
  }

  return (
    <div className="adminpaneldashboardpage">
      <h1 className="mb-4 ">Dashboard</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h1 className="display-1 text-primary">{stats.total}</h1>
                  <Card.Title>Total PIN</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h1 className="display-1 text-success">{stats.unused}</h1>
                  <Card.Title>PIN Belum Digunakan</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h1 className="display-1 text-danger">{stats.used}</h1>
                  <Card.Title>PIN Sudah Digunakan</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Status Penggunaan PIN</Card.Title>
                  <div
                    style={{ height: "300px" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {stats.total > 0 ? (
                      <Pie data={pieData} options={pieChartOptions} />
                    ) : (
                      <p className="errortextdashboard">Belum ada data PIN</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Distribusi PIN per Batch</Card.Title>
                  <div
                    style={{ height: "300px" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {stats.batches.length > 0 ? (
                      <Bar data={barData} options={barOptions} />
                    ) : (
                      <p className="errortextdashboard">Belum ada data batch</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default Dashboard;
