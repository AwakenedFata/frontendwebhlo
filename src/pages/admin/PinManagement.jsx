import { useState, useEffect, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Badge,
  Alert,
  Tabs,
  Tab,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaFileUpload,
  FaFileDownload,
  FaPlus,
  FaSync,
  FaTrash,
} from "react-icons/fa";
import Papa from "papaparse";
import "../../styles/adminstyles.css";

function PinManagement() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pinCount, setPinCount] = useState(10);
  const [pinPrefix, setPinPrefix] = useState("");
  const [generating, setGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("generate");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [importPreview, setImportPreview] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    used: 0,
    available: 0,
  });

  // Tambahkan fitur hapus multiple PIN
  // Tambahkan state untuk checkbox dan selected pins
  const [selectedPins, setSelectedPins] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
  const [deletingMultiple, setDeletingMultiple] = useState(false);

  // Tambahkan state untuk modal konfirmasi hapus
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pinToDelete, setPinToDelete] = useState(null);

  const fetchPins = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/pins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPins(response.data.pins);

      // Calculate stats
      const total = response.data.pins.length;
      const used = response.data.pins.filter((pin) => pin.used).length;

      setStats({
        total,
        used,
        available: total - used,
      });
    } catch (error) {
      console.error("Error fetching pins:", error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
      setError(
        "Gagal mengambil data PIN. " + (error.response?.data?.error || "")
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Check if admin is logged in
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchPins();
  }, [navigate, fetchPins]);

  const handleGeneratePins = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (pinCount <= 0 || pinCount > 1000) {
      setError("Jumlah PIN harus antara 1-1000");
      return;
    }

    setGenerating(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = sessionStorage.getItem("adminToken");

      const response = await axios.post(
        `${API_URL}/api/admin/generate-pins`,
        { count: pinCount, prefix: pinPrefix },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(`Berhasil generate ${response.data.count} PIN baru`);
      fetchPins();
    } catch (error) {
      console.error("Error generating pins:", error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem("adminToken"); // Ubah dari localStorage ke sessionStorage
        navigate("/admin/login");
      }
      setError("Gagal generate PIN. " + (error.response?.data?.error || ""));
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = () => {
    // Buat CSV string
    const csvContent = [
      ["PIN Code", "Status", "Redeemed By", "ID Game", "Redeemed At"],
      ...pins.map((pin) => [
        pin.code,
        pin.used ? "Used" : "Available",
        pin.redeemedBy?.nama || "",
        pin.redeemedBy?.idGame || "",
        pin.redeemedBy?.redeemedAt
          ? new Date(pin.redeemedBy.redeemedAt).toLocaleString()
          : "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Buat file dan download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pin-codes-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setImportError("");
    setImportSuccess("");
    setImportPreview([]);

    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setImportError("Hanya file CSV yang diperbolehkan");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setImportError("Error parsing CSV: " + results.errors[0].message);
          return;
        }

        // Validasi format
        const requiredColumn = "PIN Code";
        if (!results.meta.fields.includes(requiredColumn)) {
          setImportError(`File CSV harus memiliki kolom '${requiredColumn}'`);
          return;
        }

        // Preview data
        setImportPreview(results.data.slice(0, 5));
      },
      error: (error) => {
        setImportError("Error parsing CSV: " + error.message);
      },
    });
  };

  const handleImportCSV = async () => {
    if (!fileInputRef.current.files[0]) {
      setImportError("Pilih file CSV terlebih dahulu");
      return;
    }

    setIsImporting(true);
    setImportError("");
    setImportSuccess("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = sessionStorage.getItem("adminToken");

      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);

      const response = await axios.post(
        `${API_URL}/api/admin/import-pins`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImportSuccess(`Berhasil import ${response.data.imported} PIN`);
      fileInputRef.current.value = "";
      setImportPreview([]);
      fetchPins();
    } catch (error) {
      console.error("Error importing pins:", error);
      setImportError(
        "Gagal import PIN: " +
          (error.response?.data?.error || "Terjadi kesalahan")
      );
    } finally {
      setIsImporting(false);
    }
  };

  // Tambahkan fungsi untuk menangani klik tombol hapus
  const handleDeleteClick = (pin) => {
    setPinToDelete(pin);
    setShowDeleteModal(true);
  };

  // Tambahkan fungsi untuk menghapus PIN
  const handleDeletePin = async () => {
    if (!pinToDelete) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = sessionStorage.getItem("adminToken");

      await axios.delete(`${API_URL}/api/admin/pins/${pinToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Tutup modal dan refresh data
      setShowDeleteModal(false);
      setPinToDelete(null);
      setSuccessMessage("PIN berhasil dihapus");
      fetchPins();
    } catch (error) {
      console.error("Error deleting pin:", error);
      setError(
        "Gagal menghapus PIN: " +
          (error.response?.data?.error || "Terjadi kesalahan")
      );
      setShowDeleteModal(false);
    }
  };

  // Tambahkan fungsi untuk menangani select all
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      // Pilih semua PIN yang belum digunakan
      const availablePinIds = pins
        .filter((pin) => !pin.used)
        .map((pin) => pin._id);
      console.log("Selecting all available pins:", availablePinIds);
      setSelectedPins(availablePinIds);
    } else {
      console.log("Deselecting all pins");
      setSelectedPins([]);
    }
  };

  const handleSelectPin = (pinId, isChecked) => {
    console.log("Selecting pin:", pinId, isChecked);
    if (isChecked) {
      setSelectedPins((prev) => [...prev, pinId]);
    } else {
      setSelectedPins((prev) => prev.filter((id) => id !== pinId));
    }
  };

  const handleDeleteMultiplePins = async () => {
    if (selectedPins.length === 0) return;

    setDeletingMultiple(true);
    setError("");
    setSuccessMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = sessionStorage.getItem("adminToken");

      console.log("Deleting multiple pins via batch API:", selectedPins);

      const response = await axios.post(
        `${API_URL}/api/admin/delete-pins`,
        { pinIds: selectedPins },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowDeleteMultipleModal(false);
      setSelectedPins([]);
      setSelectAll(false);

      setSuccessMessage(response.data.message || "PIN berhasil dihapus");
      fetchPins();
    } catch (error) {
      console.error("Error deleting multiple pins:", error);
      setError(
        error.response?.data?.error || "Terjadi kesalahan dalam penghapusan"
      );
    } finally {
      setDeletingMultiple(false);
      setShowDeleteMultipleModal(false);
    }
  };

  return (
    <div className="adminpanelmanajemenpinpage">
      <h1 className="mb-4">Manajemen PIN</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{stats.total}</h3>
              <p className="totalpindipinmanagement mb-0">Total PIN</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-3 bg-success text-white">
            <Card.Body>
              <h3>{stats.available}</h3>
              <p className="mb-0">PIN Tersedia</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-3 bg-danger text-white">
            <Card.Body>
              <h3>{stats.used}</h3>
              <p className="mb-0">PIN Terpakai</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
            fill
          >
            <Tab eventKey="generate" title="Generate PIN">
              <Card.Body>
                <Form onSubmit={handleGeneratePins}>
                  <Row>
                    <Col md={5}>
                      <Form.Group className="mb-3">
                        <Form.Label>Jumlah PIN</Form.Label>
                        <Form.Control
                          type="number"
                          value={pinCount}
                          onChange={(e) =>
                            setPinCount(Number.parseInt(e.target.value))
                          }
                          min="1"
                          max="1000"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group className="mb-3">
                        <Form.Label>Prefix (opsional)</Form.Label>
                        <Form.Control
                          type="text"
                          value={pinPrefix}
                          onChange={(e) =>
                            setPinPrefix(e.target.value.toUpperCase())
                          }
                          placeholder="Contoh: HLO"
                          maxLength={5}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-100 mb-3"
                        disabled={generating}
                      >
                        {generating ? (
                          "Generating..."
                        ) : (
                          <>
                            <FaPlus className="me-2" /> Generate
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Tab>
            <Tab eventKey="import" title="Import CSV">
              <Card.Body>
                {importError && <Alert variant="danger">{importError}</Alert>}
                {importSuccess && (
                  <Alert variant="success">{importSuccess}</Alert>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Upload File CSV</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <Form.Text className="infotextpinmanagement">
                    File CSV harus memiliki kolom 'PIN Code'
                  </Form.Text>
                </Form.Group>

                {importPreview.length > 0 && (
                  <div className="mb-3">
                    <h6>Preview:</h6>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          {Object.keys(importPreview[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <p className="text-muted">
                      Menampilkan {importPreview.length} dari total data
                    </p>
                  </div>
                )}

                <Button
                  variant="success"
                  onClick={handleImportCSV}
                  disabled={isImporting || importPreview.length === 0}
                >
                  {isImporting ? (
                    "Importing..."
                  ) : (
                    <>
                      <FaFileUpload className="me-2" /> Import PIN
                    </>
                  )}
                </Button>
              </Card.Body>
            </Tab>
          </Tabs>
        </Card.Header>
      </Card>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Daftar PIN</span>
          <div>
            {selectedPins.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                className="me-2"
                onClick={() => setShowDeleteMultipleModal(true)}
                disabled={deletingMultiple}
              >
                <FaTrash className="me-1" />
                {deletingMultiple
                  ? "Menghapus..."
                  : `Hapus (${selectedPins.length})`}
              </Button>
            )}
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={fetchPins}
            >
              <FaSync className="me-1" /> Refresh
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={handleExportCSV}
            >
              <FaFileDownload className="me-1" /> Export CSV
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      disabled={
                        loading || pins.filter((pin) => !pin.used).length === 0
                      }
                    />
                  </th>
                  <th>PIN Code</th>
                  <th>Status</th>
                  <th>Digunakan Oleh</th>
                  <th>ID Game</th>
                  <th>Waktu Redeem</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : pins.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Belum ada PIN yang dibuat
                    </td>
                  </tr>
                ) : (
                  pins.map((pin) => (
                    <tr key={pin._id}>
                      <td>
                        {!pin.used && (
                          <Form.Check
                            type="checkbox"
                            checked={selectedPins.includes(pin._id)}
                            onChange={(e) =>
                              handleSelectPin(pin._id, e.target.checked)
                            }
                          />
                        )}
                      </td>
                      <td>
                        <code>{pin.code}</code>
                      </td>
                      <td>
                        {pin.used ? (
                          <Badge bg="danger">Terpakai</Badge>
                        ) : (
                          <Badge bg="success">Tersedia</Badge>
                        )}
                      </td>
                      <td>{pin.redeemedBy?.nama || "-"}</td>
                      <td>{pin.redeemedBy?.idGame || "-"}</td>
                      <td>
                        {pin.redeemedBy?.redeemedAt
                          ? new Date(pin.redeemedBy.redeemedAt).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        {!pin.used && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(pin)}
                            title="Hapus PIN"
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus PIN{" "}
          <strong>{pinToDelete?.code}</strong>?
          <br />
          <small className="text-danger">
            Tindakan ini tidak dapat dibatalkan.
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeletePin}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Konfirmasi Hapus Multiple */}
      <Modal
        show={showDeleteMultipleModal}
        onHide={() => !deletingMultiple && setShowDeleteMultipleModal(false)}
      >
        <Modal.Header closeButton={!deletingMultiple}>
          <Modal.Title>Konfirmasi Hapus Multiple PIN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus {selectedPins.length} PIN yang
          dipilih?
          <br />
          <small className="text-danger">
            Tindakan ini tidak dapat dibatalkan.
          </small>
          <div className="mt-3">
            <strong>PIN yang akan dihapus:</strong>
            <ul
              className="mt-2"
              style={{ maxHeight: "150px", overflowY: "auto" }}
            >
              {selectedPins.map((pinId) => {
                const pin = pins.find((p) => p._id === pinId);
                return pin ? (
                  <li key={pinId}>
                    <code>{pin.code}</code>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteMultipleModal(false)}
            disabled={deletingMultiple}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteMultiplePins}
            disabled={deletingMultiple}
          >
            {deletingMultiple ? "Menghapus..." : "Hapus"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PinManagement;
