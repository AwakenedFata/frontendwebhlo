import HeroComponent from "../components/HeroComponent";
import CommunityComponent from "../components/CommunityComponent";
import GalleryComponent from "../components/GalleryComponent";
import JoinUsComponent from "../components/JoinUsComponent";
import SponsorsComponent from "../components/SponsorsComponent";
import ContactFormComponent from "../components/ContactFormComponent";

function HomePage() {
  return (
    <main className="main-background">
      <HeroComponent />
      <CommunityComponent />
      <GalleryComponent />
      <JoinUsComponent />
      <SponsorsComponent />
      <ContactFormComponent />
    </main>
  );
}

export default HomePage;
