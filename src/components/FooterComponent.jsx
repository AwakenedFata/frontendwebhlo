import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { IoLogoInstagram } from "react-icons/io5"
import { FaWhatsapp, FaFacebookF, FaTelegramPlane } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { GoMail } from "react-icons/go";
import { TfiEmail } from "react-icons/tfi";
import footerLogo from "../assets/logo footter.png"

function FooterComponent() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="footer">
      <Container>
        {/* Main Footer Content */}
        <Row className="main-footer-row">
          {/* Left Column - Logo and Newsletter */}
          <Col lg={4} md={12} className="footer-left-col">
            <div className="footer-logo-container">
              <img src={footerLogo || "/placeholder.svg"} alt="HOK Lampung Community" className="footer-logo" />
            </div>
            <p className="footer-text">
              Jangan lewatkan info terbaru seputar event, turnamen, dan kabar menarik dari HOK Lampung! Masukkan email
              kamu untuk tetap terhubung bersama komunitas kami.
            </p>
            <div className="newsletter-form">
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Submit email" aria-label="Email address" />
                <button className="btn btn-submit" type="button">
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hoklampung.official@gmail.com">
                    <GoMail />
                  </a>
                </button>
              </div>
            </div>
          </Col>
          {/* Middle Column - About Links */}
          <Col lg={2} md={4} sm={6} className="footer-col">
            <h5 className="footer-heading">About</h5>
            <ul className="footer-links">
              <li>
                <Link to="/aboutus">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/#">Event & Turnamen</Link>
              </li>
              <li>
                <Link to="/partners">Partner & Sponsor</Link>
              </li>
              <li>
                <Link to="/#">Bantuan & Dukungan</Link>
              </li>
            </ul>
          </Col>
          {/* Middle Column - Service Links */}
          <Col lg={2} md={4} sm={6} className="footer-col">
            <h5 className="footer-heading">Service</h5>
            <ul className="footer-links">
              <li>
                <Link to="/#">Info Turnamen</Link>
              </li>
              <li>
                <Link to="https://wa.me/6285709346954">Daftar Member</Link>
              </li>
              <li>
                <Link to="https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR">Forum Diskusi</Link>
              </li>
              <li>
                <Link to="/gallery">Gallery</Link>
              </li>
            </ul>
          </Col>
          {/* Right Column - Contact Info */}
          <Col lg={4} md={4} sm={12} className="footer-col">
            <h5 className="footer-heading">Contact</h5>
            <ul className="contact-info-footer">
              <li>
                <div className="contact-icon-footer whatsapp-icon">
                  <a href="https://wa.me/6285709346954" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp />
                  </a>
                </div>
                <div className="contact-details-footer">
                  <p>+62 857-8972-5352</p>
                </div>
              </li>
              <li>
                <div className="contact-icon-footer instagram-icon">
                  <a href="https://www.instagram.com/hoklampung.official/">
                    <IoLogoInstagram />
                  </a>
                </div>
                <div className="contact-details-footer">
                  <p>hoklampung.official</p>
                </div>
              </li>
              <li>
                <div className="contact-icon-footer email-icon">
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hoklampung.official@gmail.com&su=kritik dan saran untuk hok lampung&body=kritik dan saran untuk hok lampung">
                    <TfiEmail />
                  </a>
                </div>
                <div className="contact-details-footer">
                  <p>hoklampung.official@gmail.com</p>
                </div>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Social Media Links and Copyright */}
        <Row className="bottom-footer-row">
          <Col lg={6} md={12} className="social-media-col">
            <div className="social-media-container-footer">
              <span className="follow-us-footer">Follow Us</span>
              <div className="social-icons-footer">
                <a href="https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR" className="social-icon-footer">
                  <FaWhatsapp />
                </a>
                <a href="https://www.instagram.com/hoklampung.official/" className="social-icon-footer">
                  <IoLogoInstagram />
                </a>
                <a href="https://twitter.com/honorofkings" className="social-icon-footer">
                  <FaXTwitter />
                </a>
                <a href="https://www.facebook.com/honorofkings.og.id" className="social-icon-footer">
                  <FaFacebookF />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=hoklampung.official@gmail.com"
                  className="social-icon-footer"
                >
                  <TfiEmail />
                </a>
                <a href="https://t.me/honorofkings_id" className="social-icon-footer">
                  <FaTelegramPlane />
                </a>
              </div>
            </div>
          </Col>
          <Col lg={6} md={12} className="copyright-col">
            <div className="copyright-text">
              <p>All rights reserved &copy; <span>HOK Lampung Community</span>  {currentYear}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
export default FooterComponent
