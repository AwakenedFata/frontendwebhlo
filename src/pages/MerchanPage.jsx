import postermerchan from "../assets/Merchandise/coming soon.png";
import postermerchanmobile from "../assets/Merchandise/coming soon vertikal.png";
import { useState, useEffect } from "react";

function MerchanPage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      className="merchan-page w-100 min-vh-100"
      style={{
        backgroundImage: `url(${
          isMobile ? postermerchanmobile : postermerchan
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    ></div>
  );
}

export default MerchanPage;
