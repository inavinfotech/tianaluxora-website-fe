import HeroSection from "../components/HeroSection";
import BestSellers from "../components/BestSellers";
import Features from "../components/Features";
import AboutPurpose from "../components/AboutPurpose";
import GlobalExportSection from "../components/GlobalExportSection";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <>
      <HeroSection />
      <Features />
      <AboutPurpose />
      <BestSellers />
      <GlobalExportSection />
      <Testimonials />
    </>
  );
};

export default Home;
