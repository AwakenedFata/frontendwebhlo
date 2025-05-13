import { Container, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import bgHeroVideo from '../assets/Home/herobackground_compressedsmall.mp4';
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { GrFacebookOption } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";

const HeroComponent = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTouchStart = (e) => {
    e.currentTarget.style.transform = "scale(1.2)"
  }

  const handleTouchEnd = (e) => {
    e.currentTarget.style.transform = "scale(1)"
  }

  const handleMouseEnter = (e) => {
    if (!isMobile) e.currentTarget.style.transform = "scale(1.2)";
  };

  const handleMouseLeave = (e) => {
    if (!isMobile) e.currentTarget.style.transform = "scale(1)";
  };

  const socialLinks = [
    { href: "https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR", icon: <FaWhatsapp /> },
    { href: "https://www.instagram.com/hoklampung.official/", icon: <IoLogoInstagram /> },
    { href: "https://www.facebook.com/honorofkings.og.id", icon: <GrFacebookOption /> },
    { href: " https://discord.com/invite/yM473crPms", icon: <FaDiscord /> },
    { href: "https://twitter.com/honorofkings", icon: <FaXTwitter /> },
    { href: "https://t.me/honorofkings_id", icon: <FaTelegramPlane /> },
    { href: "https://mail.google.com/mail/?view=cm&fs=1&to=hoklampung.official@gmail.com", icon: <TfiEmail /> },
  ];

  return (
    <div className="homepage">
      <header className="w-100 min-vh-100 d-flex align-items-center">
        <video autoPlay muted loop playsInline className="video-background" src={bgHeroVideo}></video>
        <Container>
          <Row className='header-box d-flex flex-lg-row flex-column align-items-center'>
            <Col lg="6">
              <img src="src/assets/Home/welcome.png" alt="#WELCOME" className='welcome' />
              <div className='social-icons'>
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </Col>
            <Col lg="6" className="pt-lg-0 pt-5 d-flex justify-content-center">
              <img src="src/assets/Home/logo 3D.png" alt="LOGOHOK" className='logo3d float-animation' />
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};

export default HeroComponent;
