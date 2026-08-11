import HeroSection from "../components/HeroSection";
import BestSellers from "../components/BestSellers";
import Collections from "../components/Collections";
import Features from "../components/Features";
import AboutPurpose from "../components/AboutPurpose";
import GlobalExportSection from "../components/GlobalExportSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <HeroSection />
      <Features />
      <AboutPurpose />
      <BestSellers />
      <Collections />
      <GlobalExportSection />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
