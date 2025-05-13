import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { navLinks } from '../data/index';
import logo from '../assets/Home/logo.png';
import { useState, useEffect } from 'react';

function NavbarComponent() {
  const [changeColor, setChangeColor] = useState(false);
  const [expanded, setExpanded] = useState(false); // ⬅️ Tambahkan state expanded
  const location = useLocation();

  useEffect(() => {
    const isHomePage = location.pathname === '/';
  
    const changeBackgroundColor = () => {
      if (isHomePage && window.scrollY <= 10) {
        setChangeColor(false);
      } else {
        setChangeColor(true);
      }
    };
  
    changeBackgroundColor();
  
    if (isHomePage) {
      window.addEventListener('scroll', changeBackgroundColor);
      return () => window.removeEventListener('scroll', changeBackgroundColor);
    }
    setExpanded(false);
  }, [location.pathname]);
  

  const handleLinkClick = () => {
    setExpanded(false); // ⬅️ Tutup navbar saat link diklik
  };

  return (
    <Navbar
      expand="lg"
      className={changeColor ? 'color-active' : ''}
      expanded={expanded} // ⬅️ Atur prop expanded
      onToggle={() => setExpanded(prev => !prev)} // ⬅️ Toggle state saat klik hamburger
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="logo-navbar">
          <img
            src={logo}
            alt="Logo Komunitas HOK Lampung"
            width="100"
            height="31.3"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {navLinks.map(link => {
              const isMerchandise = link.path === '/merchan';
              return (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={({ isActive }) => {
                    if (isMerchandise) return 'nav-link merch-button';
                    return isActive ? 'nav-link active' : 'nav-link';
                  }}
                  end={link.path === '/'}
                  onClick={handleLinkClick} // ⬅️ Tutup saat klik link
                >
                  {link.text}
                </NavLink>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
