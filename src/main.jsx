import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { setupInactivityTimer, logout } from "./utils/authUtils"
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import './styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ScrollToTop from './components/ScrollToTop.jsx'
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();

setupInactivityTimer(() => {
  logout()
  window.location.href = "/admin/login"
}, 15)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
