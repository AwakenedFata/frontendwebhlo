import { Container, Row, Col, Image } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import communityImage from "../assets/aboutus/foto.png";
import communityLogo from "../assets/aboutus/logo.png";
import aboutUsCard from "../assets/aboutus/about us.png";
import statCard1 from "../assets/aboutus/kiri 2.png";
import statCard2 from "../assets/aboutus/tengah 2.png";
import statCard3 from "../assets/aboutus/info kanan.png";

function CommunityComponent() {
  const [memberCount, setMemberCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [startCountMember, setStartCountMember] = useState(false);
  const [startCountTeam, setStartCountTeam] = useState(false);
  const memberCardRef = useRef(null);
  const teamCardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mengecek apakah elemen ada di viewport
  const isInViewport = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Scroll listener untuk memulai animasi count
  useEffect(() => {
    const handleScroll = () => {
      if (
        memberCardRef.current &&
        isInViewport(memberCardRef.current) &&
        !startCountMember
      ) {
        setStartCountMember(true);
      }
      if (
        teamCardRef.current &&
        isInViewport(teamCardRef.current) &&
        !startCountTeam
      ) {
        setStartCountTeam(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [startCountMember, startCountTeam]);

  // Count untuk member
  useEffect(() => {
    let interval;
    if (startCountMember && memberCount < 250) {
      interval = setInterval(() => {
        setMemberCount((prevCount) => {
          const increment = Math.max(1, Math.floor((250 - prevCount) / 10));
          const newCount = prevCount + increment;
          return newCount >= 250 ? 250 : newCount;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [startCountMember, memberCount]);

  // Count untuk tim
  useEffect(() => {
    let interval;
    if (startCountTeam && teamCount < 20) {
      interval = setInterval(() => {
        setTeamCount((prevCount) => {
          const increment = Math.max(1, Math.floor((20 - prevCount) / 10));
          const newCount = prevCount + increment;
          return newCount >= 20 ? 20 : newCount;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [startCountTeam, teamCount]);

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
    if (!isMobile) e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleMouseLeave = (e) => {
    if (!isMobile) e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <div className="aboutus-section w-100 min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="align-items-center">
          {/* Kiri - About Us Card */}
          <Col lg={5} className="about-card-col">
            <Image
              src={aboutUsCard || "/placeholder.svg"}
              alt="About Us Card"
              fluid
            />
          </Col>

          {/* Kanan - Logo, Foto Member, dan Stats */}
          <Col lg={7} className="right-content-col">
            {/* Logo di atas */}
            <div className="logo-container">
              <Image
                src={communityLogo || "/placeholder.svg"}
                alt="Community Logo"
                className="community-logo"
              />
            </div>

            {/* Foto Member */}
            <div className="community-image-container">
              <Image
                src={communityImage || "/placeholder.svg"}
                alt="Community Members"
                fluid
                className="community-image"
              />
            </div>

            {/* Stat Cards */}
            <Row className="stat-cards-row">
              {/* StatCard 1 + Count */}
              <Col xs="auto" className="stat-card-col" data-aos="zoom-in" data-aos-duration="1000">
                <div
                  className="stat-card-container hover-zoom"
                  ref={memberCardRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    src={statCard1 || "/placeholder.svg"}
                    alt="Stat 1"
                    fluid
                  />
                  <div className="count-wrappermember">
                    <div className="count-text">{memberCount}</div>
                  </div>
                </div>
              </Col>

              {/* StatCard 2 + Count */}
              <Col xs="auto" className="stat-card-col" data-aos="zoom-in" data-aos-duration="1000">
                <div
                  className="stat-card-container hover-zoom"
                  ref={teamCardRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    src={statCard2 || "/placeholder.svg"}
                    alt="Stat 2"
                    fluid
                  />
                  <div className="count-wrapperteam">
                    <div className="count-text">{teamCount}</div>
                  </div>
                </div>
              </Col>

              {/* StatCard 3 */}
              <Col xs="auto" className="stat-card-col" data-aos="zoom-in" data-aos-duration="1000">
                <div
                  className="stat-card-container hover-zoom"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    src={statCard3 || "/placeholder.svg"}
                    alt="Stat 3"
                    fluid
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CommunityComponent;
