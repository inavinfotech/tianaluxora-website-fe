import HeroSection from "../components/HeroSection";
import Collections from "../components/Collections";
import BestSellers from "../components/BestSellers";
import AboutPurpose from "../components/AboutPurpose";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import GlobalExportSection from "../components/GlobalExportSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      {/* <Collections /> */}
      <BestSellers />
      <AboutPurpose />
      <Features />
      <GlobalExportSection />
      <Testimonials />
    </>
  );
};

export default Home;

