import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import logoHok from "../assets/Join & Follow/logo.png";
import buttonClickQrHere from "../assets/Join & Follow/click.png";
import qrCode from "../assets/Join & Follow/qr code.png";
import phoneImage from "../assets/Join & Follow/iphone.png";

function JoinUsComponent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleTouchStart = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleTouchEnd = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  const handleMouseEnter = (e) => {
    if (!isMobile) e.currentTarget.style.transform = "scale(1.03)";
  };

  const handleMouseLeave = (e) => {
    if (!isMobile) e.currentTarget.style.transform = "scale(1)";
  };
  return (
    <div className="joinus-section w-100 min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="align-items-center">
          {/* Left Column - Logo, Text, QR */}
          <Col lg={6} className="left-content" data-aos="fade-right" data-aos-duration="1000">
            <div className="logo-container mb-4">
              <img
                src={logoHok || "/placeholder.svg"}
                alt="HOK Logo"
                className="hok-logo"
              />
            </div>

            <div className="joinus-text">
              <h1 className="main-title">Join & Follow Us</h1>
              <h2 className="hashtag">#ourallcommunity</h2>
            </div>

            <div className="qr-container">
              <div className="button-container mb-3">
                <img
                  src={buttonClickQrHere || "/placeholder.svg"}
                  alt="Click QR Here"
                  className="click-button"
                />
              </div>
              <div
                className="qr-code-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <a href="https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR" target="_blank" rel="noopener noreferrer">
                  <img
                    src={qrCode || "/placeholder.svg"}
                    alt="QR Code"
                    className="qr-code"
                  />
                </a>
              </div>
            </div>
          </Col>

          {/* Right Column - Phone Images */}
          <Col lg={6} className="right-content" data-aos="fade-left" data-aos-duration="1000">
            <div className="phone-container float-animation">
              <img
                src={phoneImage || "/placeholder.svg"}
                alt="Phone Preview"
                className="phone-image"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default JoinUsComponent;
