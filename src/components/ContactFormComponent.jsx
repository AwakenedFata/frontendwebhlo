"use client";

import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";

function ContactFormComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare email parameters
    const recipient = "hoklampung.official@gmail.com";
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Nama: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );

    // Redirect to Gmail compose
    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
  };

  return (
    <div className="contact-us-section">
      <Container>
        {/* Header Section */}
        <Row className="justify-content-center text-center mb-4">
          <Col md={10} lg={8}>
            <h5 className="contact-heading">CONTACT US</h5>
            <h1 className="contact-title">
              Hubungi Kami untuk <br /> Informasi Lebih Lanjut
            </h1>
          </Col>
        </Row>

        {/* Form Section */}
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Row>
              {/* Left Column - Form */}
              <Col lg={6}>
                <h3 className="contact-subtitle mb-4">
                  Tulis pesan kepada kami
                </h3>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Nama"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="contact-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="contact-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Subjek"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="contact-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Mulai menulis pesan di sini"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="contact-input"
                    />
                  </Form.Group>

                  <Button type="submit" className="contact-button">
                    Kirim Pesan
                  </Button>
                </Form>
              </Col>

              {/* Right Column - Contact Info */}
              <Col lg={6} className="contact-info-col">
                <div className="contact-info-text">
                  <p>
                    Apabila Kamu memiliki pertanyaan, saran, kerja sama ataupun
                    ingin bergabung dalam komunitas, jangan ragu untuk
                    menghubungi kami. Kami siap memberikan informasi yang kamu
                    butuhkan.
                  </p>
                </div>

                <div className="contact-info-items">
                  <div className="contact-info-item">
                    <div className="contact-icon">
                      <a
                        href="https://wa.me/6285709346954"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp />
                      </a>
                    </div>
                    <div className="contact-detail">
                      <h5>Whatsapp</h5>
                      <p>0857-09346-954</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon">
                      <a href="https://www.instagram.com/hoklampung.official/">
                        <FaInstagram />
                      </a>
                    </div>
                    <div className="contact-detail">
                      <h5>Instagram</h5>
                      <p>hoklampung.official</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon-email">
                      <a href='https://mail.google.com/mail/?view=cm&fs=1&to=hoklampung.official@gmail.com&su=kritik dan saran untuk hok lampung&body=kritik dan saran untuk hok lampung'>
                        <TfiEmail />
                      </a>
                    </div>
                    <div className="contact-detail">
                      <h5>Email</h5>
                      <p>hoklampung.official@gmail.com</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactFormComponent;
